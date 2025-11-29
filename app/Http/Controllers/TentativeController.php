<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\Tentative;
use App\Models\ReponseEtudiant;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Inertia\Inertia;

class TentativeController extends Controller
{
    public function submit(Request $request, $quizId)
    {
        $user = $request->user();
        
        // Vérifier que l'utilisateur est un étudiant
        if (!$user || $user->role !== 'Etudiant' || !$user->etudiant) {
            abort(403, 'Accès réservé aux étudiants');
        }
        
        $quiz = Quiz::with(['questions.choixReponses'])->findOrFail($quizId);
        $etudiant = $user->etudiant;

        $validated = $request->validate([
            'reponses' => 'required|array',
            'reponses.*.question_id' => 'required|exists:questions,id',
            'reponses.*.choix_id' => 'required|exists:choix_reponses,id',
        ]);

        // Créer la tentative
        $tentative = Tentative::create([
            'etudiant_id' => $etudiant->id,
            'quiz_id' => $quiz->id,
            'date_passage' => Carbon::now()->toDateString(),
            'heure_debut' => $request->heure_debut,
            'heure_fin' => Carbon::now()->toTimeString(),
            'statut' => 'termine',
        ]);

        $scoreObtenu = 0;
        $scoreTotal = 0;

        // Enregistrer les réponses et calculer le score
        foreach ($validated['reponses'] as $reponse) {
            $question = $quiz->questions()->find($reponse['question_id']);
            $choix = $question->choixReponses()->find($reponse['choix_id']);
            
            $estCorrect = $choix->est_correct;
            
            ReponseEtudiant::create([
                'tentative_id' => $tentative->id,
                'question_id' => $reponse['question_id'],
                'choix_id' => $reponse['choix_id'],
                'est_correct' => $estCorrect,
            ]);

            $scoreTotal += $question->points;
            if ($estCorrect) {
                $scoreObtenu += $question->points;
            }
        }

        // Mettre à jour le score
        $tentative->update([
            'score_obtenu' => $scoreObtenu,
            'score_total' => $scoreTotal,
        ]);

        return Inertia::render('QuizResult', [
            'tentative' => $tentative->load(['reponseEtudiants.question', 'reponseEtudiants.choix']),
            'quiz' => $quiz,
            'scoreObtenu' => $scoreObtenu,
            'scoreTotal' => $scoreTotal,
            'pourcentage' => ($scoreTotal > 0) ? round(($scoreObtenu / $scoreTotal) * 100, 2) : 0,
        ]);
    }
}