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
        // ========================================
        // 1. CRÉER DES PROFESSEURS
        // ========================================
        
        $userProf1 = User::create([
            'nom' => 'Alami',
            'prenom' => 'Mohammed',
            'email' => 'prof@example.com',
            'password' => Hash::make('password'),
            'role' => 'Professeur'
        ]);

        $prof1 = Professeur::create([
            'user_id' => $userProf1->id,
            'specialite' => 'Informatique',
            'grade' => 'Professeur Assistant'
        ]);

        $userProf2 = User::create([
            'nom' => 'Benjelloun',
            'prenom' => 'Fatima',
            'email' => 'prof2@example.com',
            'password' => Hash::make('password'),
            'role' => 'Professeur'
        ]);

        $prof2 = Professeur::create([
            'user_id' => $userProf2->id,
            'specialite' => 'Mathématiques',
            'grade' => 'Professeur'
        ]);

        // ========================================
        // 2. CRÉER DES ÉTUDIANTS
        // ========================================
        
        $userEtud1 = User::create([
            'nom' => 'Idrissi',
            'prenom' => 'Youssef',
            'email' => 'etudiant@example.com',
            'password' => Hash::make('password'),
            'role' => 'Etudiant'
        ]);

        $etud1 = Etudiant::create([
            'user_id' => $userEtud1->id,
            'numero_etudiant' => 'E2024001',
            'niveau' => 'L3'
        ]);

        $userEtud2 = User::create([
            'nom' => 'Karim',
            'prenom' => 'Sara',
            'email' => 'sara.karim@example.com',
            'password' => Hash::make('password'),
            'role' => 'Etudiant'
        ]);

        $etud2 = Etudiant::create([
            'user_id' => $userEtud2->id,
            'numero_etudiant' => 'E2024002',
            'niveau' => 'L3'
        ]);

        $userEtud3 = User::create([
            'nom' => 'Tazi',
            'prenom' => 'Ahmed',
            'email' => 'ahmed.tazi@example.com',
            'password' => Hash::make('password'),
            'role' => 'Etudiant'
        ]);

        $etud3 = Etudiant::create([
            'user_id' => $userEtud3->id,
            'numero_etudiant' => 'E2024003',
            'niveau' => 'L3'
        ]);

        // ========================================
        // 3. CRÉER DES MODULES
        // ========================================
        
        $module1 = Module::create([
            'code_module' => 'INF301',
            'nom_module' => 'Programmation Web',
            'description' => 'Introduction au développement web avec HTML, CSS, JavaScript, PHP et frameworks modernes',
            'semestre' => 5
        ]);

        $module2 = Module::create([
            'code_module' => 'INF302',
            'nom_module' => 'Bases de Données',
            'description' => 'Conception et gestion de bases de données relationnelles',
            'semestre' => 5
        ]);

        $module3 = Module::create([
            'code_module' => 'MAT201',
            'nom_module' => 'Algèbre Linéaire',
            'description' => 'Matrices, espaces vectoriels et applications linéaires',
            'semestre' => 3
        ]);

        // ========================================
        // 4. CRÉER DES GROUPES
        // ========================================
        
        $groupe1 = Groupe::create([
            'nom_groupe' => 'Groupe A - L3',
            'annee_academique' => '2024-2025',
            'effectif' => 30
        ]);

        $groupe2 = Groupe::create([
            'nom_groupe' => 'Groupe B - L3',
            'annee_academique' => '2024-2025',
            'effectif' => 28
        ]);

        // ========================================
        // 5. ASSOCIER PROFESSEURS ET MODULES
        // ========================================
        
        $prof1->modules()->attach([$module1->id, $module2->id]);
        $prof2->modules()->attach([$module3->id]);

        // ========================================
        // 6. ASSOCIER ÉTUDIANTS ET GROUPES
        // ========================================
        
        $etud1->groupes()->attach($groupe1->id, ['date_inscription' => now()]);
        $etud2->groupes()->attach($groupe1->id, ['date_inscription' => now()]);
        $etud3->groupes()->attach($groupe2->id, ['date_inscription' => now()]);

        // ========================================
        // 7. ASSOCIER GROUPES ET MODULES
        // ========================================
        
        $groupe1->modules()->attach([$module1->id, $module2->id]);
        $groupe2->modules()->attach([$module1->id, $module2->id]);

        // ========================================
        // 8. CRÉER UN QUIZ EXEMPLE
        // ========================================
        
        $quiz1 = \App\Models\Quiz::create([
            'professeur_id' => $prof1->id,
            'module_id' => $module1->id,
            'code_quiz' => 'DEMO2024',
            'titre' => 'Quiz de démonstration - HTML & CSS',
            'description' => 'Quiz sur les bases du HTML et CSS',
            'duree' => 30,
            'date_debut_disponibilite' => now(),
            'date_fin_disponibilite' => now()->addDays(30),
            'afficher_correction' => true,
            'nombre_tentatives_max' => 2,
            'actif' => true,
        ]);

        // Associer le quiz aux groupes
        $quiz1->groupes()->attach([$groupe1->id, $groupe2->id]);

        // Question 1
        $question1 = $quiz1->questions()->create([
            'enonce' => 'Quelle balise HTML est utilisée pour créer un lien hypertexte ?',
            'type_question' => 'QCM4',
            'points' => 1,
            'ordre' => 1,
        ]);

        $question1->choixReponses()->createMany([
            ['texte_choix' => '<link>', 'est_correct' => false, 'ordre' => 1],
            ['texte_choix' => '<a>', 'est_correct' => true, 'ordre' => 2],
            ['texte_choix' => '<href>', 'est_correct' => false, 'ordre' => 3],
            ['texte_choix' => '<hyperlink>', 'est_correct' => false, 'ordre' => 4],
        ]);

        // Question 2
        $question2 = $quiz1->questions()->create([
            'enonce' => 'Quelle propriété CSS permet de changer la couleur du texte ?',
            'type_question' => 'QCM4',
            'points' => 1,
            'ordre' => 2,
        ]);

        $question2->choixReponses()->createMany([
            ['texte_choix' => 'text-color', 'est_correct' => false, 'ordre' => 1],
            ['texte_choix' => 'font-color', 'est_correct' => false, 'ordre' => 2],
            ['texte_choix' => 'color', 'est_correct' => true, 'ordre' => 3],
            ['texte_choix' => 'text-style', 'est_correct' => false, 'ordre' => 4],
        ]);

        // Question 3
        $question3 = $quiz1->questions()->create([
            'enonce' => 'Quel attribut HTML spécifie une URL de destination pour un lien ?',
            'type_question' => 'QCM4',
            'points' => 1,
            'ordre' => 3,
        ]);

        $question3->choixReponses()->createMany([
            ['texte_choix' => 'src', 'est_correct' => false, 'ordre' => 1],
            ['texte_choix' => 'href', 'est_correct' => true, 'ordre' => 2],
            ['texte_choix' => 'link', 'est_correct' => false, 'ordre' => 3],
            ['texte_choix' => 'url', 'est_correct' => false, 'ordre' => 4],
        ]);

        // Question 4
        $question4 = $quiz1->questions()->create([
            'enonce' => 'Quelle propriété CSS est utilisée pour créer un espace à l\'intérieur d\'un élément ?',
            'type_question' => 'QCM3',
            'points' => 1,
            'ordre' => 4,
        ]);

        $question4->choixReponses()->createMany([
            ['texte_choix' => 'margin', 'est_correct' => false, 'ordre' => 1],
            ['texte_choix' => 'padding', 'est_correct' => true, 'ordre' => 2],
            ['texte_choix' => 'border', 'est_correct' => false, 'ordre' => 3],
        ]);

        // ========================================
        // 9. CRÉER UN DEUXIÈME QUIZ
        // ========================================
        
        $quiz2 = \App\Models\Quiz::create([
            'professeur_id' => $prof1->id,
            'module_id' => $module2->id,
            'code_quiz' => 'SQL2024',
            'titre' => 'Quiz SQL - Bases de données',
            'description' => 'Questions sur les requêtes SQL de base',
            'duree' => 45,
            'date_debut_disponibilite' => now(),
            'date_fin_disponibilite' => now()->addDays(30),
            'afficher_correction' => true,
            'nombre_tentatives_max' => 1,
            'actif' => true,
        ]);

        $quiz2->groupes()->attach([$groupe1->id]);

        // Question 1
        $q1 = $quiz2->questions()->create([
            'enonce' => 'Quelle commande SQL permet de sélectionner toutes les données d\'une table ?',
            'type_question' => 'QCM4',
            'points' => 1,
            'ordre' => 1,
        ]);

        $q1->choixReponses()->createMany([
            ['texte_choix' => 'GET * FROM table', 'est_correct' => false, 'ordre' => 1],
            ['texte_choix' => 'SELECT * FROM table', 'est_correct' => true, 'ordre' => 2],
            ['texte_choix' => 'EXTRACT * FROM table', 'est_correct' => false, 'ordre' => 3],
            ['texte_choix' => 'RETRIEVE * FROM table', 'est_correct' => false, 'ordre' => 4],
        ]);

        // Question 2
        $q2 = $quiz2->questions()->create([
            'enonce' => 'Quelle clause SQL est utilisée pour filtrer les résultats ?',
            'type_question' => 'QCM4',
            'points' => 1,
            'ordre' => 2,
        ]);

        $q2->choixReponses()->createMany([
            ['texte_choix' => 'FILTER', 'est_correct' => false, 'ordre' => 1],
            ['texte_choix' => 'WHERE', 'est_correct' => true, 'ordre' => 2],
            ['texte_choix' => 'HAVING', 'est_correct' => false, 'ordre' => 3],
            ['texte_choix' => 'CONDITION', 'est_correct' => false, 'ordre' => 4],
        ]);

        echo "\n✅ Seeder exécuté avec succès !\n\n";
        echo "📧 Comptes créés :\n";
        echo "   Professeur 1: prof@example.com / password\n";
        echo "   Professeur 2: prof2@example.com / password\n";
        echo "   Étudiant 1: etudiant@example.com / password\n";
        echo "   Étudiant 2: sara.karim@example.com / password\n";
        echo "   Étudiant 3: ahmed.tazi@example.com / password\n\n";
        echo "🎯 Quiz créés :\n";
        echo "   Quiz 1: DEMO2024 (HTML & CSS)\n";
        echo "   Quiz 2: SQL2024 (Bases de données)\n\n";
    }
}