'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Eye, Package, Truck, CheckCircle, XCircle, Clock, Calendar, ChevronDown } from 'lucide-react';

interface Order {
    id: string;
    orderNumber: string;
    email: string;
    phone: string | null;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    total: number;
    status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    paymentStatus: 'UNPAID' | 'PAID' | 'REFUNDED';
    createdAt: string;
    user?: {
        name: string | null;
        email: string;
    };
    items?: {
        id: string;
        quantity: number;
        price: number;
        product: {
            name: string;
        };
    }[];
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

const paymentStatusColors = {
    UNPAID: 'bg-gray-100 text-gray-600',
    PAID: 'bg-green-100 text-green-800',
    REFUNDED: 'bg-red-100 text-red-800',
};

const paymentStatusLabels = {
    UNPAID: 'Non payé',
    PAID: 'Payé',
    REFUNDED: 'Remboursé',
};

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPayment, setFilterPayment] = useState('all');
    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/orders');
            if (!res.ok) throw new Error('Erreur de chargement');
            const data = await res.json();
            setOrders(data);

            // Calculer le chiffre d'affaires total
            const revenue = data.reduce((sum: number, order: Order) => {
                if (order.status === 'DELIVERED' || order.paymentStatus === 'PAID') {
                    return sum + order.total;
                }
                return sum;
            }, 0);
            setTotalRevenue(revenue);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filtrer les commandes
    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
        const matchesPayment = filterPayment === 'all' || order.paymentStatus === filterPayment;
        return matchesSearch && matchesStatus && matchesPayment;
    });

    // Changer le statut d'une commande
    const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) throw new Error('Erreur lors du changement de statut');

            setOrders(orders.map((o) =>
                o.id === orderId ? { ...o, status: newStatus } : o
            ));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Erreur lors du changement de statut');
        }
    };

    // Changer le statut de paiement
    const handlePaymentStatusChange = async (orderId: string, newPaymentStatus: Order['paymentStatus']) => {
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentStatus: newPaymentStatus }),
            });

            if (!res.ok) throw new Error('Erreur lors du changement de statut de paiement');

            setOrders(orders.map((o) =>
                o.id === orderId ? { ...o, paymentStatus: newPaymentStatus } : o
            ));
        } catch (error) {
            console.error('Error updating payment status:', error);
            alert('Erreur lors du changement de statut de paiement');
        }
    };

    const toggleExpandOrder = (orderId: string) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    // Statistiques
    const stats = {
        total: orders.length,
        pending: orders.filter((o) => o.status === 'PENDING').length,
        confirmed: orders.filter((o) => o.status === 'CONFIRMED').length,
        shipped: orders.filter((o) => o.status === 'SHIPPED').length,
        delivered: orders.filter((o) => o.status === 'DELIVERED').length,
        cancelled: orders.filter((o) => o.status === 'CANCELLED').length,
        unpaid: orders.filter((o) => o.paymentStatus === 'UNPAID').length,
        revenue: totalRevenue,
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div>
            {/* En-tête */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif text-gray-800">
                        Commandes
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Gérez toutes les commandes de votre boutique
                    </p>
                </div>
                <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-500">
            {stats.total} commandes
          </span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
            {stats.revenue.toFixed(2)}€
          </span>
                </div>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mb-6">
                <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center">
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-lg font-bold text-gray-800">{stats.total}</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-3 shadow-sm border border-yellow-100 text-center">
                    <p className="text-xs text-yellow-600">En attente</p>
                    <p className="text-lg font-bold text-yellow-700">{stats.pending}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 shadow-sm border border-blue-100 text-center">
                    <p className="text-xs text-blue-600">Confirmées</p>
                    <p className="text-lg font-bold text-blue-700">{stats.confirmed}</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-3 shadow-sm border border-purple-100 text-center">
                    <p className="text-xs text-purple-600">Expédiées</p>
                    <p className="text-lg font-bold text-purple-700">{stats.shipped}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-3 shadow-sm border border-green-100 text-center">
                    <p className="text-xs text-green-600">Livrées</p>
                    <p className="text-lg font-bold text-green-700">{stats.delivered}</p>
                </div>
                <div className="bg-red-50 rounded-xl p-3 shadow-sm border border-red-100 text-center">
                    <p className="text-xs text-red-600">Annulées</p>
                    <p className="text-lg font-bold text-red-700">{stats.cancelled}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 shadow-sm border border-gray-100 text-center">
                    <p className="text-xs text-gray-500">Non payées</p>
                    <p className="text-lg font-bold text-gray-700">{stats.unpaid}</p>
                </div>
            </div>

            {/* Filtres et recherche */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher par n° commande, email, nom..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:outline-none"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:outline-none bg-white"
                >
                    <option value="all">Tous les statuts</option>
                    <option value="PENDING">En attente</option>
                    <option value="CONFIRMED">Confirmée</option>
                    <option value="SHIPPED">Expédiée</option>
                    <option value="DELIVERED">Livrée</option>
                    <option value="CANCELLED">Annulée</option>
                </select>
                <select
                    value={filterPayment}
                    onChange={(e) => setFilterPayment(e.target.value)}
                    className="px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:outline-none bg-white"
                >
                    <option value="all">Tous les paiements</option>
                    <option value="PAID">Payé</option>
                    <option value="UNPAID">Non payé</option>
                    <option value="REFUNDED">Remboursé</option>
                </select>
                <button
                    onClick={fetchOrders}
                    className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                    🔄 Rafraîchir
                </button>
            </div>

            {/* Tableau */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Commande
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Client
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Statut
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Paiement
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                                    Chargement...
                                </td>
                            </tr>
                        ) : filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                                    Aucune commande trouvée
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map((order) => (
                                <>
                                    <tr key={order.id} className="hover:bg-gray-50 transition">
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="font-medium text-gray-800">{order.orderNumber}</p>
                                                <p className="text-xs text-gray-400">
                                                    {order.items?.length || 0} article(s)
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="font-medium text-gray-800">
                                                    {order.user?.name || order.email}
                                                </p>
                                                <p className="text-xs text-gray-400">{order.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-primary-600">
                                            {order.total.toFixed(2)}€
                                        </td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                                                className={`text-xs px-2.5 py-1 rounded-full font-medium border-0 focus:ring-2 focus:ring-primary-300 ${statusColors[order.status]}`}
                                            >
                                                {Object.entries(statusLabels).map(([key, label]) => (
                                                    <option key={key} value={key} className="text-gray-800">
                                                        {label}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={order.paymentStatus}
                                                onChange={(e) => handlePaymentStatusChange(order.id, e.target.value as Order['paymentStatus'])}
                                                className={`text-xs px-2.5 py-1 rounded-full font-medium border-0 focus:ring-2 focus:ring-primary-300 ${paymentStatusColors[order.paymentStatus]}`}
                                            >
                                                {Object.entries(paymentStatusLabels).map(([key, label]) => (
                                                    <option key={key} value={key} className="text-gray-800">
                                                        {label}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                {formatDate(order.createdAt)}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1">
                                                <button
                                                    onClick={() => toggleExpandOrder(order.id)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="Voir les détails"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
                                                >
                                                    <ChevronDown className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* Détails de la commande (expandé) */}
                                    {expandedOrder === order.id && order.items && (
                                        <tr>
                                            <td colSpan={7} className="px-4 py-3 bg-gray-50">
                                                <div className="space-y-2">
                                                    <p className="font-medium text-sm text-gray-700">Détails de la commande</p>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                                        {order.items.map((item) => (
                                                            <div key={item.id} className="flex justify-between items-center border-b border-gray-100 py-1">
                                  <span className="text-gray-600">
                                    {item.product.name} × {item.quantity}
                                  </span>
                                                                <span className="font-medium text-gray-800">
                                    {(item.price * item.quantity).toFixed(2)}€
                                  </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                                        <span className="font-semibold text-gray-700">Total</span>
                                                        <span className="font-bold text-primary-600">{order.total.toFixed(2)}€</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        <p>📍 {order.address}, {order.postalCode} {order.city}, {order.country}</p>
                                                        {order.phone && <p>📞 {order.phone}</p>}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}