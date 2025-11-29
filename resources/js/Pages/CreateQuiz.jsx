import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';

export default function CreateQuiz({ modules, groupes }) {
    const { data, setData, post, processing, errors } = useForm({
        titre: '',
        module_id: '',
        description: '',
        duree: 30,
        afficher_correction: true,
        nombre_tentatives_max: 1,
        groupes: [],
    });

    const [questions, setQuestions] = useState([
        {
            enonce: '',
            type_question: 'QCM4',
            points: 1,
            ordre: 1,
            choix: [
                { texte: '', est_correct: false, ordre: 1 },
                { texte: '', est_correct: false, ordre: 2 },
                { texte: '', est_correct: false, ordre: 3 },
                { texte: '', est_correct: false, ordre: 4 },
            ]
        }
    ]);

    const addQuestion = () => {
        setQuestions([...questions, {
            enonce: '',
            type_question: 'QCM4',
            points: 1,
            ordre: questions.length + 1,
            choix: [
                { texte: '', est_correct: false, ordre: 1 },
                { texte: '', est_correct: false, ordre: 2 },
                { texte: '', est_correct: false, ordre: 3 },
                { texte: '', est_correct: false, ordre: 4 },
            ]
        }]);
    };

    const removeQuestion = (index) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
    };

    const updateQuestion = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        
        // Si on change le type de QCM, ajuster les choix
        if (field === 'type_question') {
            const choixCount = value === 'QCM3' ? 3 : 4;
            newQuestions[index].choix = Array(choixCount).fill(0).map((_, i) => ({
                texte: newQuestions[index].choix[i]?.texte || '',
                est_correct: newQuestions[index].choix[i]?.est_correct || false,
                ordre: i + 1
            }));
        }
        
        setQuestions(newQuestions);
    };

    const updateChoix = (questionIndex, choixIndex, field, value) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].choix[choixIndex][field] = value;
        
        // Si on marque une réponse comme correcte, décocher les autres
        if (field === 'est_correct' && value === true) {
            newQuestions[questionIndex].choix.forEach((c, i) => {
                if (i !== choixIndex) c.est_correct = false;
            });
        }
        
        setQuestions(newQuestions);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Valider qu'il y a au moins une question
        if (questions.length === 0) {
            alert('Ajoutez au moins une question');
            return;
        }

        // Valider que chaque question a une bonne réponse
        for (let i = 0; i < questions.length; i++) {
            const hasCorrectAnswer = questions[i].choix.some(c => c.est_correct);
            if (!hasCorrectAnswer) {
                alert(`La question ${i + 1} doit avoir au moins une bonne réponse`);
                return;
            }
        }

        post('/quiz', {
            data: {
                ...data,
                questions: questions
            }
        });
    };

    return (
        <>
            <Head title="Créer un Quiz" />
            
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-6">
                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={() => router.visit('/dashboard')}
                            className="text-blue-500 hover:underline mb-4"
                        >
                            ← Retour au Dashboard
                        </button>
                        <h1 className="text-4xl font-bold text-gray-800">Créer un nouveau Quiz</h1>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Informations générales */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-2xl font-bold mb-4">Informations du Quiz</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        Titre du Quiz *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.titre}
                                        onChange={e => setData('titre', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ex: Quiz de Programmation Web"
                                        required
                                    />
                                    {errors.titre && <p className="text-red-500 text-sm mt-1">{errors.titre}</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        Module *
                                    </label>
                                    <select
                                        value={data.module_id}
                                        onChange={e => setData('module_id', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Sélectionner un module</option>
                                        {modules && modules.map(module => (
                                            <option key={module.id} value={module.id}>
                                                {module.code_module} - {module.nom_module}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.module_id && <p className="text-red-500 text-sm mt-1">{errors.module_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        Durée (minutes) *
                                    </label>
                                    <input
                                        type="number"
                                        value={data.duree}
                                        onChange={e => setData('duree', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        min="1"
                                        required
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        Description (optionnel)
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="3"
                                        placeholder="Description du quiz..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        Nombre de tentatives
                                    </label>
                                    <input
                                        type="number"
                                        value={data.nombre_tentatives_max}
                                        onChange={e => setData('nombre_tentatives_max', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        min="1"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="afficher_correction"
                                        checked={data.afficher_correction}
                                        onChange={e => setData('afficher_correction', e.target.checked)}
                                        className="mr-2"
                                    />
                                    <label htmlFor="afficher_correction" className="text-gray-700">
                                        Afficher la correction après le quiz
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Questions */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold">Questions</h2>
                                <button
                                    type="button"
                                    onClick={addQuestion}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                                >
                                    + Ajouter une question
                                </button>
                            </div>

                            {questions.map((question, qIndex) => (
                                <div key={qIndex} className="border border-gray-200 rounded-lg p-4 mb-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold">Question {qIndex + 1}</h3>
                                        {questions.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeQuestion(qIndex)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                ✕ Supprimer
                                            </button>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-semibold mb-2">
                                            Énoncé de la question *
                                        </label>
                                        <textarea
                                            value={question.enonce}
                                            onChange={e => updateQuestion(qIndex, 'enonce', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            rows="2"
                                            placeholder="Tapez votre question ici..."
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">
                                                Type de QCM
                                            </label>
                                            <select
                                                value={question.type_question}
                                                onChange={e => updateQuestion(qIndex, 'type_question', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="QCM3">3 choix</option>
                                                <option value="QCM4">4 choix</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">
                                                Points
                                            </label>
                                            <input
                                                type="number"
                                                value={question.points}
                                                onChange={e => updateQuestion(qIndex, 'points', parseFloat(e.target.value))}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                step="0.5"
                                                min="0"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">
                                            Choix de réponses (cochez la bonne réponse)
                                        </label>
                                        {question.choix.map((choix, cIndex) => (
                                            <div key={cIndex} className="flex items-center gap-2 mb-2">
                                                <input
                                                    type="radio"
                                                    name={`correct-${qIndex}`}
                                                    checked={choix.est_correct}
                                                    onChange={e => updateChoix(qIndex, cIndex, 'est_correct', e.target.checked)}
                                                    className="w-5 h-5"
                                                />
                                                <input
                                                    type="text"
                                                    value={choix.texte}
                                                    onChange={e => updateChoix(qIndex, cIndex, 'texte', e.target.value)}
                                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder={`Choix ${cIndex + 1}`}
                                                    required
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Boutons */}
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => router.visit('/dashboard')}
                                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                            >
                                {processing ? 'Création...' : 'Créer le Quiz'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}