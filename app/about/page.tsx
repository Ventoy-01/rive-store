'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export default function AboutPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Formulaire soumis:', formData);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Navbar */}
            <Navbar />

            <main className="flex-grow pt-16 m-2">
                <div className="container-custom py-16">
                    {/* En-tête */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-serif text-primary-700 mb-4">
                            À propos de RiveStore
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Découvrez notre histoire, notre mission et notre passion pour l'élégance
                        </p>
                    </div>

                    {/* Histoire */}
                    <div className="grid md:grid-cols-2 gap-12 mb-20 items-center">
                        <div>
                            <h2 className="text-2xl font-serif text-primary-700 mb-4">
                                Notre histoire
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                RiveStore est née d'une passion pour la mode et l'élégance. Fondée en 2020
                                par une équipe de créateurs passionnés, notre boutique propose une sélection
                                soigneusement choisie de vêtements, cosmétiques et accessoires pour femmes
                                élégantes.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Chaque pièce que nous proposons est choisie avec soin pour allier qualité,
                                confort et style intemporel. Nous croyons que chaque femme mérite de se
                                sentir belle et confiante au quotidien.
                            </p>
                        </div>
                        <div className="relative h-80 rounded-2xl overflow-hidden bg-primary-50">
                            <div className="absolute inset-0 flex items-center justify-center text-7xl">
                                🌸
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-100/50 to-accent-100/50"></div>
                        </div>
                    </div>

                    {/* Section Contact - avec ID pour le lien */}
                    <div id="contact" className="scroll-mt-20">
                        <div className="bg-primary-50 rounded-3xl p-8 md:p-12">
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-serif text-primary-700 mb-3">
                                    Contactez-nous
                                </h2>
                                <p className="text-gray-600">
                                    Une question ? Un projet ? N'hésitez pas à nous écrire !
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-12">
                                {/* Informations de contact */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary-200 rounded-xl flex items-center justify-center">
                                            <Mail className="w-6 h-6 text-primary-700" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium text-gray-800">contact@rivestore.com</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary-200 rounded-xl flex items-center justify-center">
                                            <Phone className="w-6 h-6 text-primary-700" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Téléphone</p>
                                            <p className="font-medium text-gray-800">+33 1 23 45 67 89</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary-200 rounded-xl flex items-center justify-center">
                                            <MapPin className="w-6 h-6 text-primary-700" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Adresse</p>
                                            <p className="font-medium text-gray-800">123 Rue de l'Élégance, 75001 Paris</p>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <p className="text-sm text-gray-500">Horaires d'ouverture</p>
                                        <p className="text-gray-800">Lun - Ven : 9h00 - 19h00</p>
                                        <p className="text-gray-800">Sam : 10h00 - 18h00</p>
                                        <p className="text-gray-500 text-sm">Dimanche : Fermé</p>
                                    </div>
                                </div>

                                {/* Formulaire de contact */}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nom complet *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:outline-none"
                                            placeholder="Votre nom"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:outline-none"
                                            placeholder="votre@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Message *
                                        </label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:outline-none"
                                            placeholder="Votre message..."
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn-primary w-full flex items-center justify-center gap-2 py-3"
                                    >
                                        <Send className="w-4 h-4" />
                                        {submitted ? '✅ Message envoyé !' : 'Envoyer le message'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}