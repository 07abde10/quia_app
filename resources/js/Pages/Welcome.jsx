import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Bienvenue" />
            
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                <div className="text-center text-white">
                    <h1 className="text-6xl font-bold mb-4">Quiz App</h1>
                    <p className="text-2xl mb-8">Application de Gestion de Quiz</p>
                    
                    <div className="space-x-4">
                        <Link
                            href="/login"
                            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block"
                        >
                            Se Connecter
                        </Link>
                        <Link
                            href="/register"
                            className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition inline-block"
                        >
                            S'inscrire
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}