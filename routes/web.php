<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\TentativeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Page d'accueil
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

// Routes d'authentification
Route::middleware('guest')->group(function () {
    Route::get('/login', function () {
        return Inertia::render('Login');
    })->name('login');
    
    Route::post('/login', [AuthController::class, 'login']);
    
    Route::get('/register', [RegisterController::class, 'create'])->name('register');
    Route::post('/register', [RegisterController::class, 'store']);
});

Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth');

// Routes protégées
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Routes Quiz (Professeur)
    Route::get('/quiz/create', [QuizController::class, 'create'])->name('quiz.create');
    Route::post('/quiz', [QuizController::class, 'store'])->name('quiz.store');
    Route::get('/quiz/{id}', [QuizController::class, 'show'])->name('quiz.show');
    Route::get('/quiz/{id}/edit', [QuizController::class, 'edit'])->name('quiz.edit');
    Route::put('/quiz/{id}', [QuizController::class, 'update'])->name('quiz.update');
    Route::delete('/quiz/{id}', [QuizController::class, 'destroy'])->name('quiz.destroy');
    Route::get('/quiz/{id}/results', [QuizController::class, 'results'])->name('quiz.results');
    
    // Routes pour les étudiants
    Route::post('/quiz/access', [QuizController::class, 'accessByCode'])->name('quiz.access');
    Route::post('/quiz/{id}/submit', [TentativeController::class, 'submit'])->name('quiz.submit');
});