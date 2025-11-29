<?php
namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Professeur;
use App\Models\Etudiant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RegisterController extends Controller
{
    public function create()
    {
        return Inertia::render('Register');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:100',
            'prenom' => 'required|string|max:100',
            'email' => 'required|string|email|max:150|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:Professeur,Etudiant',
            'numero_etudiant' => 'required_if:role,Etudiant|nullable|string|unique:etudiants,numero_etudiant',
            'niveau' => 'nullable|string',
            'specialite' => 'required_if:role,Professeur|nullable|string',
            'grade' => 'nullable|string',
        ]);

        // Créer l'utilisateur
        $user = User::create([
            'nom' => $validated['nom'],
            'prenom' => $validated['prenom'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        // Créer le profil selon le rôle
        if ($validated['role'] === 'Professeur') {
            Professeur::create([
                'user_id' => $user->id,
                'specialite' => $validated['specialite'],
                'grade' => $validated['grade'],
            ]);
        } else {
            Etudiant::create([
                'user_id' => $user->id,
                'numero_etudiant' => $validated['numero_etudiant'],
                'niveau' => $validated['niveau'],
            ]);
        }

        // Connecter l'utilisateur automatiquement
        Auth::login($user);

        return redirect()->route('dashboard');
    }
}
