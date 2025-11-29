import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        nom: '',
        prenom: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'Etudiant',
        numero_etudiant: '',
        niveau: '',
        specialite: '',
        grade: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <>
            <Head title="Inscription" />
            
            <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
                    <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Inscription</h2>
                    
                    <form onSubmit={handleSubmit}>
                        {/* Type de compte */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-semibold mb-2">Type de compte</label>
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        value="Etudiant"
                                        checked={data.role === 'Etudiant'}
                                        onChange={e => setData('role', e.target.value)}
                                        className="mr-2"
                                    />
                                    👨‍🎓 Étudiant
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        value="Professeur"
                                        checked={data.role === 'Professeur'}
                                        onChange={e => setData('role', e.target.value)}
                                        className="mr-2"
                                    />
                                    👨‍🏫 Professeur
                                </label>
                            </div>
                        </div>

                        {/* Informations personnelles */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Nom *</label>
                                <input
                                    type="text"
                                    value={data.nom}
                                    onChange={e => setData('nom', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Prénom *</label>
                                <input
                                    type="text"
                                    value={data.prenom}
                                    onChange={e => setData('prenom', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                {errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom}</p>}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Mot de passe *</label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Confirmer le mot de passe *</label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        {/* Champs spécifiques selon le rôle */}
                        {data.role === 'Etudiant' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Numéro étudiant *</label>
                                    <input
                                        type="text"
                                        value={data.numero_etudiant}
                                        onChange={e => setData('numero_etudiant', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ex: E2024001"
                                        required
                                    />
                                    {errors.numero_etudiant && <p className="text-red-500 text-sm mt-1">{errors.numero_etudiant}</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Niveau</label>
                                    <select
                                        value={data.niveau}
                                        onChange={e => setData('niveau', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Sélectionner</option>
                                        <option value="L1">L1</option>
                                        <option value="L2">L2</option>
                                        <option value="L3">L3</option>
                                        <option value="M1">M1</option>
                                        <option value="M2">M2</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {data.role === 'Professeur' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Spécialité *</label>
                                    <input
                                        type="text"
                                        value={data.specialite}
                                        onChange={e => setData('specialite', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ex: Informatique"
                                        required
                                    />
                                    {errors.specialite && <p className="text-red-500 text-sm mt-1">{errors.specialite}</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Grade</label>
                                    <input
                                        type="text"
                                        value={data.grade}
                                        onChange={e => setData('grade', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ex: Professeur Assistant"
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50"
                        >
                            {processing ? 'Inscription...' : 'S\'inscrire'}
                        </button>
                    </form>
                    
                    <p className="mt-6 text-center text-gray-600">
                        Déjà inscrit ? <Link href="/login" className="text-blue-500 hover:underline">Se connecter</Link>
                    </p>
                </div>
            </div>
        </>
    );
}