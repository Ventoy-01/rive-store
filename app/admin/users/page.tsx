'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Edit, Trash2, UserCheck, UserX, Shield, ShieldOff, Mail, Calendar } from 'lucide-react';

interface User {
    id: string;
    name: string | null;
    email: string;
    role: string;
    image: string | null;
    createdAt: string;
    _count?: {
        orders: number;
    };
}

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/users');
            if (!res.ok) throw new Error('Erreur de chargement');
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filtrer les utilisateurs
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    // Changer le rôle d'un utilisateur
    const handleRoleChange = async (userId: string, newRole: string) => {
        if (!confirm(`Changer le rôle de cet utilisateur en "${newRole}" ?`)) return;

        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole }),
            });

            if (!res.ok) throw new Error('Erreur lors du changement de rôle');

            // Mettre à jour la liste localement
            setUsers(users.map((u) =>
                u.id === userId ? { ...u, role: newRole } : u
            ));
        } catch (error) {
            console.error('Error updating role:', error);
            alert('Erreur lors du changement de rôle');
        }
    };

    // Supprimer un utilisateur
    const handleDeleteUser = async (userId: string, userName: string) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${userName}" ? Cette action est irréversible.`)) return;

        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Erreur lors de la suppression');

            setUsers(users.filter((u) => u.id !== userId));
            setSelectedUsers(selectedUsers.filter((id) => id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Erreur lors de la suppression');
        }
    };

    // Supprimer plusieurs utilisateurs
    const handleBulkDelete = async () => {
        if (selectedUsers.length === 0) return;
        if (!confirm(`Supprimer ${selectedUsers.length} utilisateur(s) ?`)) return;

        try {
            await Promise.all(
                selectedUsers.map((id) =>
                    fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
                )
            );
            setUsers(users.filter((u) => !selectedUsers.includes(u.id)));
            setSelectedUsers([]);
        } catch (error) {
            console.error('Error bulk deleting:', error);
            alert('Erreur lors de la suppression multiple');
        }
    };

    const toggleSelectUser = (userId: string) => {
        setSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedUsers.length === filteredUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(filteredUsers.map((u) => u.id));
        }
    };

    // Statistiques
    const stats = {
        total: users.length,
        admins: users.filter((u) => u.role === 'ADMIN').length,
        users: users.filter((u) => u.role === 'USER').length,
    };

    return (
        <div>
            {/* En-tête */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif text-gray-800">
                        Utilisateurs
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Gérez les comptes utilisateurs de votre boutique
                    </p>
                </div>
                <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-500">
            {stats.total} utilisateurs
          </span>
                    <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs">
            {stats.admins} Admins
          </span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
            {stats.users} Clients
          </span>
                </div>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500">Administrateurs</p>
                    <p className="text-2xl font-bold text-primary-600">{stats.admins}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500">Clients</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.users}</p>
                </div>
            </div>

            {/* Filtres et recherche */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher par nom ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:outline-none"
                    />
                </div>
                <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:outline-none bg-white"
                >
                    <option value="all">Tous les rôles</option>
                    <option value="ADMIN">Administrateurs</option>
                    <option value="USER">Clients</option>
                </select>
                {selectedUsers.length > 0 && (
                    <button
                        onClick={handleBulkDelete}
                        className="px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        Supprimer ({selectedUsers.length})
                    </button>
                )}
                <button
                    onClick={fetchUsers}
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
                            <th className="px-4 py-3 text-left">
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                    onChange={toggleSelectAll}
                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Utilisateur
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rôle
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Commandes
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Inscrit le
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
                        ) : filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                                    Aucun utilisateur trouvé
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(user.id)}
                                            onChange={() => toggleSelectUser(user.id)}
                                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold text-sm overflow-hidden">
                                                {user.image ? (
                                                    <img
                                                        src={user.image}
                                                        alt={user.name || user.email}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    (user.name || user.email).charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <span className="font-medium text-gray-800">
                          {user.name || 'Utilisateur sans nom'}
                        </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                      <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                              user.role === 'ADMIN'
                                  ? 'bg-primary-100 text-primary-700'
                                  : 'bg-gray-100 text-gray-700'
                          }`}
                      >
                        {user.role === 'ADMIN' ? 'Admin' : 'Client'}
                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {user._count?.orders || 0}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                            {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-1">
                                            {user.role === 'ADMIN' ? (
                                                <button
                                                    onClick={() => handleRoleChange(user.id, 'USER')}
                                                    className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
                                                    title="Retirer les droits admin"
                                                >
                                                    <ShieldOff className="w-4 h-4" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleRoleChange(user.id, 'ADMIN')}
                                                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
                                                    title="Promouvoir admin"
                                                >
                                                    <Shield className="w-4 h-4" />
                                                </button>
                                            )}
                                            <Link
                                                href={`/admin/users/${user.id}`}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteUser(user.id, user.name || user.email)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}