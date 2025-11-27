<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        $quizzes = [];
        
        if ($user->role === 'Professeur' && $user->professeur) {
            $quizzes = Quiz::where('professeur_id', $user->professeur->id)
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return Inertia::render('Dashboard', [
            'quizzes' => $quizzes
        ]);
    }
}