'use client';

import { useState } from 'react';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        const res = await fetch('/api/newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        if (res.ok) {
            setStatus('success');
            setEmail('');
            setTimeout(() => setStatus('idle'), 3000);
        } else {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <section className="bg-gradient-to-r from-primary-100 to-accent-100 py-16">
            <div className="container-custom text-center">
                <h2 className="text-3xl font-serif text-primary-700 mb-4">
                    Newsletter
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Recevez nos offres exclusives et nos nouveautés directement dans votre boîte mail
                </p>

                <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                    <input
                        type="email"
                        placeholder="Votre email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="flex-1 px-4 py-3 rounded-lg border border-primary-200 focus:border-primary-500 focus:outline-none"
                    />
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="btn-primary px-6 py-3 whitespace-nowrap disabled:opacity-50"
                    >
                        {status === 'loading' ? '...' : 'S\'inscrire'}
                    </button>
                </form>

                {status === 'success' && (
                    <p className="text-green-600 mt-4">✓ Inscription réussie !</p>
                )}
                {status === 'error' && (
                    <p className="text-red-600 mt-4">✗ Une erreur est survenue</p>
                )}
            </div>
        </section>
    );
}