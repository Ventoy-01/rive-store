'use client';

import { useState, useEffect } from 'react';
import {
    Package,
    ShoppingBag,
    Users,
    TrendingUp,
    UserCog,
} from 'lucide-react';
import StatsCard from './components/StatsCard';
import RecentOrders from './components/RecentOrders';
import Link from "next/link";

interface Stats {
    totalProducts: number;
    totalOrders: number;
    totalUsers: number;
    revenue: number;
    revenueChange: number;
    ordersChange: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/stats')
            .then((res) => res.json())
            .then((data) => {
                setStats(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading || !stats) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl md:text-3xl font-serif text-gray-800">
                    Tableau de bord
                </h1>
                <span className="text-sm text-gray-500">
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
        </span>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    title="Chiffre d'affaires"
                    value={`${stats.revenue.toFixed(2)}€`}
                    icon={TrendingUp}
                    change={stats.revenueChange}
                    color="primary"
                />
                <StatsCard
                    title="Commandes"
                    value={stats.totalOrders}
                    icon={ShoppingBag}
                    change={stats.ordersChange}
                    color="green"
                />
                <StatsCard
                    title="Produits"
                    value={stats.totalProducts}
                    icon={Package}
                    color="purple"
                />
                <StatsCard
                    title="Utilisateurs"
                    value={stats.totalUsers}
                    icon={Users}
                    color="blue"
                />
            </div>

            {/* Graphique / Activité récente */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="font-semibold text-gray-800 mb-4">Activité récente</h2>
                    <RecentOrders />
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="font-semibold text-gray-800 mb-4">Actions rapides</h2>
                    <div className="space-y-3">
                        <button className="w-full bg-primary-50 text-primary-700 p-3 rounded-lg hover:bg-primary-100 transition">
                            <Link href="/admin/products/new" className="flex items-center justify-center gap-2">
                                <Package size={20} />
                            + Ajouter un produit
                            </Link>
                        </button>
                        <button className="w-full bg-green-50 text-green-700 p-3 rounded-lg hover:bg-green-100 transition">
                            <Link href="/admin/orders" className="flex items-center justify-center gap-2">
                                <ShoppingBag size={20} />
                            Voir les commandes
                                </Link>
                        </button>
                        <button className="w-full bg-blue-50 text-blue-700 p-3 rounded-lg hover:bg-blue-100 transition">
                            <Link href="/admin/users" className="flex items-center justify-center gap-2">
                                <UserCog size={20} />
                             Gérer les utilisateurs
                            </Link>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}