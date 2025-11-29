<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\Module;
use App\Models\Groupe;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class QuizController extends Controller
{
    public function create(Request $request)
    {
        $user = $request->user();
        
        // Vérifier que l'utilisateur est un professeur
        if (!$user || $user->role !== 'Professeur' || !$user->professeur) {
            abort(403, 'Accès réservé aux professeurs');
        }
        
        $modules = Module::all();
        $groupes = Groupe::all();
        
        return Inertia::render('CreateQuiz', [
            'modules' => $modules,
            'groupes' => $groupes
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        
        // Vérifier que l'utilisateur est un professeur
        if (!$user || $user->role !== 'Professeur' || !$user->professeur) {
            abort(403, 'Accès réservé aux professeurs');
        }
        
        $validated = $request->validate([
            'titre' => 'required|string|max:200',
            'module_id' => 'required|exists:modules,id',
            'description' => 'nullable|string',
            'duree' => 'required|integer|min:1',
            'afficher_correction' => 'boolean',
            'nombre_tentatives_max' => 'required|integer|min:1',
            'questions' => 'required|array|min:1',
            'questions.*.enonce' => 'required|string',
            'questions.*.type_question' => 'required|in:QCM3,QCM4',
            'questions.*.points' => 'required|numeric|min:0',
            'questions.*.choix' => 'required|array|min:3',
            'questions.*.choix.*.texte' => 'required|string',
            'questions.*.choix.*.est_correct' => 'required|boolean',
        ]);

        // Générer un code unique pour le quiz
        do {
            $code_quiz = strtoupper(Str::random(8));
        } while (Quiz::where('code_quiz', $code_quiz)->exists());

        // Créer le quiz
        $quiz = Quiz::create([
            'professeur_id' => $user->professeur->id,
            'module_id' => $validated['module_id'],
            'code_quiz' => $code_quiz,
            'titre' => $validated['titre'],
            'description' => $validated['description'],
            'duree' => $validated['duree'],
            'afficher_correction' => $validated['afficher_correction'] ?? true,
            'nombre_tentatives_max' => $validated['nombre_tentatives_max'],
            'actif' => true,
        ]);

        // Créer les questions et leurs choix
        foreach ($validated['questions'] as $questionData) {
            $question = $quiz->questions()->create([
                'enonce' => $questionData['enonce'],
                'type_question' => $questionData['type_question'],
                'points' => $questionData['points'],
                'ordre' => $questionData['ordre'],
            ]);

            foreach ($questionData['choix'] as $choixData) {
                $question->choixReponses()->create([
                    'texte_choix' => $choixData['texte'],
                    'est_correct' => $choixData['est_correct'],
                    'ordre' => $choixData['ordre'],
                ]);
            }
        }

        return redirect()->route('dashboard')->with('message', 'Quiz créé avec succès ! Code: ' . $code_quiz);
    }

    public function show($id)
    {
        $quiz = Quiz::with(['questions.choixReponses', 'module', 'professeur.user'])
            ->findOrFail($id);

        return Inertia::render('ShowQuiz', [
            'quiz' => $quiz
        ]);
    }

    public function edit(Request $request, $id)
    {
        $user = $request->user();
        $quiz = Quiz::with(['questions.choixReponses'])->findOrFail($id);
        
        // Vérifier que c'est bien le professeur propriétaire
        if (!$user || !$user->professeur || $quiz->professeur_id !== $user->professeur->id) {
            abort(403, 'Non autorisé');
        }
        
        $modules = Module::all();
        $groupes = Groupe::all();

        return Inertia::render('EditQuiz', [
            'quiz' => $quiz,
            'modules' => $modules,
            'groupes' => $groupes
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        $quiz = Quiz::findOrFail($id);

        // Vérifier que c'est bien le professeur propriétaire
        if (!$user || !$user->professeur || $quiz->professeur_id !== $user->professeur->id) {
            abort(403, 'Non autorisé');
        }

        $validated = $request->validate([
            'titre' => 'required|string|max:200',
            'module_id' => 'required|exists:modules,id',
            'description' => 'nullable|string',
            'duree' => 'required|integer|min:1',
            'afficher_correction' => 'boolean',
            'nombre_tentatives_max' => 'required|integer|min:1',
            'actif' => 'boolean',
        ]);

        $quiz->update($validated);

        return redirect()->route('dashboard')->with('message', 'Quiz mis à jour avec succès !');
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $quiz = Quiz::findOrFail($id);

        // Vérifier que c'est bien le professeur propriétaire
        if (!$user || !$user->professeur || $quiz->professeur_id !== $user->professeur->id) {
            abort(403, 'Non autorisé');
        }

        $quiz->delete();

        return redirect()->route('dashboard')->with('message', 'Quiz supprimé avec succès !');
    }

    public function accessByCode(Request $request)
    {
        $request->validate([
            'code_quiz' => 'required|string',
        ]);

        $quiz = Quiz::where('code_quiz', $request->code_quiz)
            ->where('actif', true)
            ->with(['questions.choixReponses'])
            ->first();

        if (!$quiz) {
            return back()->withErrors(['code_quiz' => 'Code invalide ou quiz inactif']);
        }

        return Inertia::render('TakeQuiz', [
            'quiz' => $quiz
        ]);
    }

    public function results(Request $request, $id)
    {
        $user = $request->user();
        $quiz = Quiz::with(['tentatives.etudiant.user'])->findOrFail($id);

        // Vérifier que c'est bien le professeur propriétaire
        if (!$user || !$user->professeur || $quiz->professeur_id !== $user->professeur->id) {
            abort(403, 'Non autorisé');
        }

        return Inertia::render('QuizResults', [
            'quiz' => $quiz,
            'tentatives' => $quiz->tentatives()->with('etudiant.user')->get()
        ]);
    }
}