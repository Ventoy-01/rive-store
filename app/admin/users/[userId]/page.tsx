'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Save, X, User, Mail, Phone, Shield, Calendar, Package, ArrowLeft } from 'lucide-react';

interface User {
    id: string;
    name: string | null;
    email: string;
    password?: string;
    role: string;
    image: string | null;
    createdAt: string;
    updatedAt: string;
    _count?: {
        orders: number;
    };
    orders?: {
        id: string;
        orderNumber: string;
        total: number;
        status: string;
        createdAt: string;
    }[];
}

export default function EditUserPage() {
    const params = useParams();
    const router = useRouter();
    const userId = params.userId as string;

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // État du formulaire
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'USER',
        password: '',
        confirmPassword: '',
    });

    useEffect(() => {
        fetchUser();
    }, [userId]);

    const fetchUser = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/users/${userId}`);
            if (!res.ok) throw new Error('Utilisateur non trouvé');
            const data = await res.json();
            setUser(data);
            setFormData({
                name: data.name || '',
                email: data.email || '',
                role: data.role || 'USER',
                password: '',
                confirmPassword: '',
            });
        } catch (error) {
            console.error('Error fetching user:', error);
            setError('Impossible de charger l\'utilisateur');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        // Validation
        if (formData.password && formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            setSaving(false);
            return;
        }

        if (formData.password && formData.password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            setSaving(false);
            return;
        }

        // Préparer les données à envoyer
        const dataToSend: any = {
            name: formData.name,
            email: formData.email,
            role: formData.role,
        };

        if (formData.password) {
            dataToSend.password = formData.password;
        }

        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Erreur lors de la mise à jour');
            }

            setSuccess('✅ Utilisateur mis à jour avec succès !');

            // Recharger les données
            await fetchUser();

            // Rediriger après 2 secondes
            setTimeout(() => {
                router.push('/admin/users');
            }, 2000);
        } catch (error: any) {
            setError(error.message || 'Erreur lors de la mise à jour');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-20">
                <div className="text-6xl mb-4">👤</div>
                <h2 className="text-2xl font-serif mb-4">Utilisateur non trouvé</h2>
                <Link href="/admin/users" className="btn-primary">
                    Retour à la liste
                </Link>
            </div>
        );
    }

    return (
        <div>
            {/* En-tête */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/users"
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif text-gray-800">
                        Modifier l'utilisateur
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Gérez les informations de l'utilisateur
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulaire principal */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
                        {/* Messages */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                                {success}
                            </div>
                        )}

                        {/* Nom */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nom complet
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:outline-none"
                                    placeholder="Nom de l'utilisateur"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email *
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:outline-none"
                                    placeholder="email@exemple.com"
                                />
                            </div>
                        </div>

                        {/* Rôle */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Rôle
                            </label>
                            <div className="relative">
                                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:outline-none bg-white"
                                >
                                    <option value="USER">👤 Client</option>
                                    <option value="ADMIN">👑 Administrateur</option>
                                </select>
                            </div>
                        </div>

                        {/* Mot de passe */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nouveau mot de passe
                                <span className="text-xs text-gray-400 ml-2">(laisser vide pour ne pas changer)</span>
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:outline-none"
                                placeholder="Nouveau mot de passe"
                                minLength={6}
                            />
                        </div>

                        {/* Confirmer le mot de passe */}
                        {formData.password && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirmer le mot de passe
                                </label>
                                <input
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:outline-none"
                                    placeholder="Confirmer le mot de passe"
                                />
                            </div>
                        )}

                        {/* Boutons */}
                        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={saving}
                                className="btn-primary flex items-center gap-2 px-6 py-2.5 disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                            </button>
                            <Link
                                href="/admin/users"
                                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-center"
                            >
                                Annuler
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Informations du profil */}
                <div className="space-y-6">
                    {/* Carte de profil */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                        <div className="w-24 h-24 mx-auto rounded-full bg-primary-100 flex items-center justify-center text-3xl font-bold text-primary-600 overflow-hidden mb-4">
                            {user.image ? (
                                <Image
                                    src={user.image}
                                    alt={user.name || user.email}
                                    width={96}
                                    height={96}
                                    className="object-cover"
                                />
                            ) : (
                                (user.name || user.email).charAt(0).toUpperCase()
                            )}
                        </div>
                        <h3 className="font-semibold text-gray-800">{user.name || 'Sans nom'}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <span
                            className={`inline-block mt-2 text-xs px-3 py-1 rounded-full font-medium ${
                                user.role === 'ADMIN'
                                    ? 'bg-primary-100 text-primary-700'
                                    : 'bg-gray-100 text-gray-700'
                            }`}
                        >
              {user.role === 'ADMIN' ? '👑 Administrateur' : '👤 Client'}
            </span>
                    </div>

                    {/* Statistiques */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-3">
                        <h4 className="font-semibold text-gray-700">Statistiques</h4>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Commandes</span>
                            <span className="font-medium text-gray-800">
                {user._count?.orders || 0}
              </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Inscrit le</span>
                            <span className="font-medium text-gray-800">
                {new Date(user.createdAt).toLocaleDateString('fr-FR')}
              </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Dernière mise à jour</span>
                            <span className="font-medium text-gray-800">
                {new Date(user.updatedAt).toLocaleDateString('fr-FR')}
              </span>
                        </div>
                    </div>

                    {/* Dernières commandes */}
                    {user.orders && user.orders.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h4 className="font-semibold text-gray-700 mb-3">Dernières commandes</h4>
                            <div className="space-y-2">
                                {user.orders.slice(0, 3).map((order) => (
                                    <Link
                                        key={order.id}
                                        href={`/admin/orders/${order.id}`}
                                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">
                                                {order.orderNumber}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-primary-600">
                                                {order.total.toFixed(2)}€
                                            </p>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                            }`}>
                        {order.status}
                      </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}