'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    Settings,
    LogOut,
    Flower,
    ViewIcon,
} from 'lucide-react';

const navItems = [
    { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Produits', icon: Package },
    { href: '/admin/orders', label: 'Commandes', icon: ShoppingBag },
    { href: '/admin/users', label: 'Utilisateurs', icon: Users },
    { href: '/admin/', label: 'Paramètres', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200">
                <Link href="/admin" className="flex items-center gap-2">
                    <Flower className="w-7 h-7 text-primary-600" />
                    <span className="font-serif text-xl font-bold text-primary-700">
            RiveStore Admin
          </span>
                </Link>
            </div>

            {/* Navigation principale */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href || pathname?.startsWith(href + '/');
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${
                                isActive
                                    ? 'bg-primary-50 text-primary-700 font-medium'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : ''}`} />
                            {label}
                        </Link>
                    );
                })}

                {/* Séparateur + Lien "Voir le site" */}
                <div className="pt-4 mt-4 border-t border-gray-200">
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition bg-primary-50 text-primary-700 font-medium hover:bg-primary-100 border border-primary-200"
                    >
                        <ViewIcon className="w-5 h-5 text-primary-600" />
                        Voir le site
                        <span className="ml-auto text-xs text-primary-400">↗</span>
                    </a>
                </div>
            </nav>

            {/* Déconnexion */}
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                >
                    <LogOut className="w-5 h-5" />
                    Déconnexion
                </button>
            </div>
        </div>
    );
}