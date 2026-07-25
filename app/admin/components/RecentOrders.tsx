'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Order {
    id: string;
    orderNumber: string;
    email: string;
    total: number;
    status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    createdAt: string;
}

const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
};

const statusLabels = {
    PENDING: 'En attente',
    CONFIRMED: 'Confirmée',
    SHIPPED: 'Expédiée',
    DELIVERED: 'Livrée',
    CANCELLED: 'Annulée',
};

export default function RecentOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/orders?limit=5')
            .then((res) => res.json())
            .then((data) => {
                setOrders(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="text-center py-4 text-gray-500">Chargement...</div>;
    }

    if (orders.length === 0) {
        return <div className="text-center py-4 text-gray-500">Aucune commande récente</div>;
    }

    return (
        <div className="space-y-3">
            {orders.map((order) => (
                <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition border border-gray-50"
                >
                    <div>
                        <p className="font-medium text-gray-800">{order.orderNumber}</p>
                        <p className="text-sm text-gray-500">{order.email}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold text-primary-600">{order.total}€</p>
                        <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                                statusColors[order.status]
                            }`}
                        >
              {statusLabels[order.status]}
            </span>
                    </div>
                </Link>
            ))}
            <div className="text-center pt-2">
                <Link
                    href="/admin/orders"
                    className="text-sm text-primary-600 hover:text-primary-700"
                >
                    Voir toutes les commandes →
                </Link>
            </div>
        </div>
    );
}