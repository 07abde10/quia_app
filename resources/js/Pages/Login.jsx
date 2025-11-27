import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="Connexion" />
            
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Connexion</h2>
                    
                    {errors.email && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {errors.email}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="votre@email.com"
                                required
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Mot de passe</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        
                        <div className="mb-6 flex items-center">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={data.remember}
                                onChange={e => setData('remember', e.target.checked)}
                                className="mr-2"
                            />
                            <label htmlFor="remember" className="text-gray-700">Se souvenir de moi</label>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Connexion...' : 'Se connecter'}
                        </button>
                    </form>
                    
                    <p className="mt-6 text-center text-gray-600">
                        Pas de compte ? <Link href="/register" className="text-blue-500 hover:underline">S'inscrire</Link>
                    </p>
                </div>
            </div>
        </>
    );
}