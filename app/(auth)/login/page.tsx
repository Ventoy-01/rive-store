'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError('Email ou mot de passe incorrect');
            setLoading(false);
        } else {
            router.push('/');
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
                <span className="text-5xl mb-4 block">🌸</span>
                <h1 className="text-2xl font-serif text-primary-700">Connexion</h1>
                <p className="text-gray-600 mt-2">Retrouvez votre espace personnel</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:outline-none"
                        placeholder="votre@email.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mot de passe
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:outline-none"
                        placeholder="••••••••"
                    />
                </div>

                {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3 disabled:opacity-50"
                >
                    {loading ? 'Connexion...' : 'Se connecter'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Pas encore de compte ?{' '}
                    <Link href="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
                        Créer un compte
                    </Link>
                </p>
            </div>
        </div>
    );
}