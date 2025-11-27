import React from 'react';
import { Head, Link, router } from '@inertiajs/react';

export default function Dashboard({ auth, quizzes = [] }) {
    const user = auth.user;

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <>
            <Head title="Dashboard" />
            
            <div className="min-h-screen bg-gray-50">
                {/* Navigation */}
                <nav className="bg-white shadow-md">
                    <div className="container mx-auto px-6 py-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    {user.role === 'Professeur' ? '👨‍🏫 Espace Professeur' : '👨‍🎓 Espace Étudiant'}
                                </h1>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-gray-700">
                                    Bienvenue, <strong>{user.prenom} {user.nom}</strong>
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                                >
                                    Déconnexion
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Contenu Principal */}
                <div className="container mx-auto px-6 py-8">
                    {user.role === 'Professeur' ? (
                        <div>
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-800">Mes Quiz</h2>
                                <Link
                                    href="/quiz/create"
                                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-semibold"
                                >
                                    ➕ Créer un Quiz
                                </Link>
                            </div>

                            {quizzes.length === 0 ? (
                                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                    <p className="text-gray-500 text-lg">Aucun quiz créé pour le moment.</p>
                                    <Link
                                        href="/quiz/create"
                                        className="inline-block mt-4 text-blue-500 hover:underline"
                                    >
                                        Créer votre premier quiz →
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {quizzes.map((quiz) => (
                                        <div key={quiz.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                                            <h3 className="text-xl font-bold mb-2 text-gray-800">{quiz.titre}</h3>
                                            <div className="mb-4 space-y-1">
                                                <p className="text-gray-600">
                                                    <span className="font-semibold">Code:</span> 
                                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2 font-mono">
                                                        {quiz.code_quiz}
                                                    </span>
                                                </p>
                                                <p className="text-gray-600">⏱️ Durée: {quiz.duree} minutes</p>
                                                <p className="text-gray-600">
                                                    {quiz.actif ? 
                                                        <span className="text-green-600">✅ Actif</span> : 
                                                        <span className="text-red-600">❌ Inactif</span>
                                                    }
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/quiz/${quiz.id}/edit`}
                                                    className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition text-center"
                                                >
                                                    ✏️ Modifier
                                                </Link>
                                                <Link
                                                    href={`/quiz/${quiz.id}/results`}
                                                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition text-center"
                                                >
                                                    📊 Résultats
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-8">Quiz Disponibles</h2>
                            
                            <div className="bg-white rounded-lg shadow-md p-8">
                                <div className="text-center">
                                    <h3 className="text-xl font-semibold mb-4">Rejoindre un Quiz</h3>
                                    <p className="text-gray-600 mb-6">Entrez le code fourni par votre professeur</p>
                                    
                                    <form className="max-w-md mx-auto">
                                        <input
                                            type="text"
                                            placeholder="CODE-QUIZ"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center font-mono text-lg"
                                        />
                                        <button
                                            type="submit"
                                            className="w-full mt-4 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-semibold"
                                        >
                                            Accéder au Quiz
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}