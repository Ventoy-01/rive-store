'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/app/lib/cart-context';
import {
    Search,
    Heart,
    ShoppingBag,
    User,
    ChevronDown,
    X,
    Menu,
    Flame,
    Sparkles,
    Shirt,
    Droplets,
    Footprints,
    Package,
    LogOut,
    UserCog,
    Flower,
    Home,
    Store,
    Group,
} from 'lucide-react';

export default function Navbar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { data: session } = useSession();
    const { cart } = useCart();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    // Mettre à jour le compteur du panier
    useEffect(() => {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(count);
    }, [cart]);

    // Effet de scroll pour changer le style de la navbar
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Gestion de la recherche
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
            setIsMenuOpen(false);
        }
    };

    // Logique d'activation des liens
    const isActiveLink = (href: string) => {
        if (href === '/') return pathname === '/';
        if (href === '/products') {
            // Boutique est actif sur toutes les pages produits (avec ou sans paramètres)
            return pathname === '/products';
        }
        if (href.includes('badge=PROMO')) {
            return pathname === '/products' && searchParams.get('badge') === 'PROMO';
        }
        if (href.includes('badge=BEST_SELLER')) {
            return pathname === '/products' && searchParams.get('badge') === 'BEST_SELLER';
        }
        if (href.includes('isNew=true')) {
            return pathname === '/products' && searchParams.get('isNew') === 'true';
        }
        if (href.includes('category=')) {
            const category = href.split('category=')[1];
            return pathname === '/products' && searchParams.get('category') === category;
        }
        return false;
    };

    // Liens principaux
    const navLinks = [
        { href: '/', label: 'Accueil', icon: Home },
        { href: '/products', label: 'Boutique', icon: Store },
        { href: '/products?badge=PROMO', label: 'Promotions', icon: Flame },
        { href: '/products?isNew=true', label: 'Nouveautés', icon: Sparkles },
        { href: '/products?badge=BEST_SELLER', label: 'Populaires', icon: Group },
    ];

    // Catégories pour le dropdown
    const categories = [
        { href: '/products?category=VETEMENTS', label: 'Vêtements', icon: Shirt },
        { href: '/products?category=COSMETIQUES', label: 'Cosmétiques', icon: Droplets },
        { href: '/products?category=SANDALES', label: 'Sandales', icon: Footprints },
        { href: '/products?category=ACCESSOIRES', label: 'Accessoires', icon: Package },
    ];

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 border-b-2 border-primary-500 ${
                isScrolled ? 'bg-white shadow-lg py-2' : 'bg-white/90 backdrop-blur-md py-4'
            }`}
                >
            <div className="container-custom">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <Flower className="w-7 h-7 text-primary-600" strokeWidth={1.5} />
                        <span className="font-serif text-2xl font-bold text-primary-700 hidden sm:inline">
              RiveStore
            </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center space-x-6">
                        {navLinks.map(({ href, label, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                className={`flex items-center gap-1.5 text-gray-700 hover:text-primary-500 transition whitespace-nowrap ${
                                    isActiveLink(href) ? 'text-primary-600 border-b-2 border-primary-500' : ''
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </Link>
                        ))}

                        {/* Dropdown Catégories */}
                        <div className="relative group">
                            <button className="text-gray-700 hover:text-primary-500 flex items-center gap-1">
                                Catégories
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-1">
                                {categories.map(({ href, label, icon: Icon }) => (
                                    <Link
                                        key={href}
                                        href={href}
                                        className="flex items-center gap-2 px-4 py-2 hover:bg-primary-50"
                                    >
                                        <Icon className="w-4 h-4 text-primary-500" />
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Actions (droite) */}
                    <div className="flex items-center gap-3">
                        {/* Barre de recherche (desktop) */}
                        <form
                            onSubmit={handleSearch}
                            className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary-300"
                        >
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent outline-none text-sm w-32 lg:w-40"
                            />
                            <button type="submit" className="text-gray-500 hover:text-primary-500">
                                <Search className="w-4 h-4" />
                            </button>
                        </form>

                        {/* Favoris / Wishlist */}
                        <Link href="/wishlist" className="text-gray-700 hover:text-primary-500 transition">
                            <Heart className="w-6 h-6" strokeWidth={1.5} />
                        </Link>

                        {/* Panier */}
                        <Link href="/cart" className="relative text-gray-700 hover:text-primary-500 transition">
                            <ShoppingBag className="w-6 h-6" strokeWidth={1.5} />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
                            )}
                        </Link>

                        {/* Authentification */}
                        {session ? (
                            <div className="relative group">
                                <button className="flex items-center gap-1.5 text-gray-700 hover:text-primary-500 transition">
                                    <User className="w-6 h-6" strokeWidth={1.5} />
                                    <span className="hidden md:inline text-sm">
                    {session.user?.name?.split(' ')[0] || 'Compte'}
                  </span>
                                </button>
                                <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-1">
                                    <Link
                                        href="/profile"
                                        className="flex items-center gap-2 px-4 py-2 hover:bg-primary-50"
                                    >
                                        <User className="w-4 h-4" /> Mon profil
                                    </Link>
                                    <Link
                                        href="/orders"
                                        className="flex items-center gap-2 px-4 py-2 hover:bg-primary-50"
                                    >
                                        <Package className="w-4 h-4" /> Mes commandes
                                    </Link>
                                    <Link
                                        href="/wishlist"
                                        className="flex items-center gap-2 px-4 py-2 hover:bg-primary-50"
                                    >
                                        <Heart className="w-4 h-4" /> Mes favoris
                                    </Link>
                                    <hr className="my-1" />
                                    {session.user?.role === 'ADMIN' && (
                                        <Link
                                            href="/admin"
                                            className="flex items-center gap-2 px-4 py-2 hover:bg-primary-50 text-primary-600"
                                        >
                                            <UserCog className="w-4 h-4" /> Dashboard admin
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => signOut({ callbackUrl: '/' })}
                                        className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-primary-50 text-red-500"
                                    >
                                        <LogOut className="w-4 h-4" /> Déconnexion
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link href="/login" className="btn-primary py-2 px-4 text-sm whitespace-nowrap">
                                Connexion
                            </Link>
                        )}

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden text-gray-700 hover:text-primary-500 transition"
                        >
                            {isMenuOpen ? (
                                <X className="w-7 h-7" />
                            ) : (
                                <Menu className="w-7 h-7" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden py-4 border-t mt-4 space-y-3">
                        {navLinks.map(({ href, label, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setIsMenuOpen(false)}
                                className={`flex items-center gap-2 text-gray-700 hover:text-primary-500 py-1 ${
                                    isActiveLink(href) ? 'text-primary-600 font-semibold' : ''
                                }`}
                            >
                                <Icon className="w-5 h-5" /> {label}
                            </Link>
                        ))}

                        <div className="pt-2 border-t border-gray-200">
                            <p className="text-sm font-semibold text-gray-500 mb-2">Catégories</p>
                            {categories.map(({ href, label, icon: Icon }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-2 text-gray-700 hover:text-primary-500 py-1"
                                >
                                    <Icon className="w-5 h-5 text-primary-500" /> {label}
                                </Link>
                            ))}
                        </div>

                        {/* Search mobile */}
                        <form
                            onSubmit={handleSearch}
                            className="pt-2 border-t border-gray-200 flex items-center gap-2"
                        >
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 p-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:outline-none"
                            />
                            <button type="submit" className="btn-primary py-2 px-4 text-sm">
                                <Search className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </nav>
    );
}