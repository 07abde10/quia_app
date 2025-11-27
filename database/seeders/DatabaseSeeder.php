<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Professeur;
use App\Models\Etudiant;
use App\Models\Module;
use App\Models\Groupe;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Créer un professeur
        $userProf = User::create([
            'nom' => 'Alami',
            'prenom' => 'Mohammed',
            'email' => 'prof@example.com',
            'password' => Hash::make('password'),
            'role' => 'Professeur'
        ]);

        Professeur::create([
            'user_id' => $userProf->id,
            'specialite' => 'Informatique',
            'grade' => 'Professeur Assistant'
        ]);

        // Créer un étudiant
        $userEtud = User::create([
            'nom' => 'Idrissi',
            'prenom' => 'Fatima',
            'email' => 'etudiant@example.com',
            'password' => Hash::make('password'),
            'role' => 'Etudiant'
        ]);

        Etudiant::create([
            'user_id' => $userEtud->id,
            'numero_etudiant' => 'E2024001',
            'niveau' => 'L3'
        ]);

        // Créer des modules
        Module::create([
            'code_module' => 'INF301',
            'nom_module' => 'Programmation Web',
            'description' => 'Introduction au développement web',
            'semestre' => 5
        ]);

        // Créer un groupe
        Groupe::create([
            'nom_groupe' => 'Groupe A',
            'annee_academique' => '2024-2025',
            'effectif' => 30
        ]);
    }
}