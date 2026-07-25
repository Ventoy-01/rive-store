'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Grid, List, Filter, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/app/components/ProductCard';
import ProductFilters from '@/app/components/ProductFilters';

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice: number | null;
    images: string[];
    category: string;
    rating: number;
    badge: string | null;
    isNew?: boolean;
    isFeatured?: boolean;
}

export default function ProductsPage() {
    const searchParams = useSearchParams();

    // Filtres depuis l'URL
    const [filters, setFilters] = useState({
        category: searchParams.get('category') || 'all',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        sort: searchParams.get('sort') || 'newest',
        search: searchParams.get('search') || '',
        badge: searchParams.get('badge') || '',
        isNew: searchParams.get('isNew') === 'true',
    });

    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Mettre à jour les filtres quand l'URL change
    useEffect(() => {
        setFilters({
            category: searchParams.get('category') || 'all',
            minPrice: searchParams.get('minPrice') || '',
            maxPrice: searchParams.get('maxPrice') || '',
            sort: searchParams.get('sort') || 'newest',
            search: searchParams.get('search') || '',
            badge: searchParams.get('badge') || '',
            isNew: searchParams.get('isNew') === 'true',
        });
    }, [searchParams]);

    // Récupérer TOUS les produits
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.category !== 'all') params.append('category', filters.category);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.search) params.append('search', filters.search);
        params.append('sort', filters.sort);
        params.append('limit', '100');

        try {
            const res = await fetch(`/api/products?${params}`);
            const data = await res.json();
            setAllProducts(data);
        } catch (error) {
            console.error('Erreur de chargement des produits :', error);
            setAllProducts([]);
        } finally {
            setLoading(false);
        }
    }, [filters.category, filters.minPrice, filters.maxPrice, filters.search, filters.sort]);

    // Charger les produits
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Filtrer localement selon badge et isNew
    const filteredProducts = useMemo(() => {
        let result = allProducts;

        // Filtre badge
        if (filters.badge) {
            result = result.filter((p) => p.badge === filters.badge);
        }

        // Filtre isNew
        if (filters.isNew) {
            result = result.filter((p) => p.isNew === true);
        }

        return result;
    }, [allProducts, filters.badge, filters.isNew]);

    // Réinitialiser tous les filtres
    const resetFilters = () => {
        setFilters({
            category: 'all',
            minPrice: '',
            maxPrice: '',
            sort: 'newest',
            search: '',
            badge: '',
            isNew: false,
        });
    };

    // Animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-primary-50/30 py-12 mt-5">
            <div className="container-custom">
                {/* Breadcrumb et en-tête */}
                <div className="mb-10">
                    <nav className="text-sm text-gray-500 mb-3" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2">
                            <li>
                                <Link href="/" className="hover:text-primary-600 transition">
                                    Accueil
                                </Link>
                            </li>
                            <li className="text-gray-300">/</li>
                            <li className="text-primary-600 font-medium">Boutique</li>
                        </ol>
                    </nav>

                    <div className="flex flex-col md:flex-row md:items-end justify-between m-2">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-serif text-primary-700 ">
                                Notre collection
                                <span className="block text-sm font-sans font-light text-gray-500 mt-1">
                                    {loading ? 'Chargement...' : `${filteredProducts.length} produit${filteredProducts.length > 1 ? 's' : ''}`}
                                </span>
                            </h1>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            {/* Filtres actifs */}
                            {filters.category !== 'all' && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
                                    {filters.category.toLowerCase()}
                                    <button
                                        onClick={() => setFilters((prev) => ({ ...prev, category: 'all' }))}
                                        className="ml-1 hover:text-primary-900"
                                        aria-label="Supprimer le filtre catégorie"
                                    >
                                        ✕
                                    </button>
                                </span>
                            )}
                            {filters.badge && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-xs">
                                    {filters.badge.toLowerCase()}
                                    <button
                                        onClick={() => setFilters((prev) => ({ ...prev, badge: '' }))}
                                        className="ml-1 hover:text-accent-900"
                                        aria-label="Supprimer le badge"
                                    >
                                        ✕
                                    </button>
                                </span>
                            )}
                            {filters.isNew && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                                    ✨ Nouveau
                                    <button
                                        onClick={() => setFilters((prev) => ({ ...prev, isNew: false }))}
                                        className="ml-1 hover:text-green-900"
                                        aria-label="Supprimer le filtre nouveauté"
                                    >
                                        ✕
                                    </button>
                                </span>
                            )}
                            {filters.search && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
                                    "{filters.search}"
                                    <button
                                        onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
                                        className="ml-1 hover:text-primary-900"
                                        aria-label="Supprimer la recherche"
                                    >
                                        ✕
                                    </button>
                                </span>
                            )}
                            {/* Vue grille / liste */}
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 transition ${
                                        viewMode === 'grid'
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-white text-gray-500 hover:bg-gray-50'
                                    }`}
                                    aria-label="Vue grille"
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 transition ${
                                        viewMode === 'list'
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-white text-gray-500 hover:bg-gray-50'
                                    }`}
                                    aria-label="Vue liste"
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contenu principal */}
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Sidebar filtres */}
                    <aside className="lg:w-1/4">
                        <div className="sticky top-24">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                                        <Filter className="w-4 h-4 text-primary-500" />
                                        Filtres
                                    </h2>
                                    <button
                                        onClick={resetFilters}
                                        className="text-xs text-primary-500 hover:text-primary-700 transition"
                                    >
                                        Réinitialiser
                                    </button>
                                </div>
                                <ProductFilters filters={filters} setFilters={setFilters} />
                            </div>
                        </div>
                    </aside>

                    {/* Liste des produits */}
                    <div className="lg:w-3/4">
                        {/* Barre de tri rapide (mobile) */}
                        <div className="flex items-center justify-between mb-6 lg:hidden">
                            <span className="text-sm text-gray-500">
                                {loading ? 'Chargement...' : `${filteredProducts.length} produits`}
                            </span>
                            <button
                                onClick={() =>
                                    document.getElementById('filters-mobile')?.scrollIntoView({ behavior: 'smooth' })
                                }
                                className="btn-secondary py-1.5 px-4 text-sm flex items-center gap-1"
                            >
                                <Filter className="w-4 h-4" />
                                Filtrer
                            </button>
                        </div>

                        {/* Loading */}
                        {loading ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="bg-gray-200 rounded-2xl aspect-square mb-4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                ))}
                            </motion.div>
                        ) : filteredProducts.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100"
                            >
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-serif text-gray-700 mb-2">Aucun produit trouvé</h3>
                                <p className="text-gray-500 max-w-sm mx-auto">
                                    Essayez de modifier vos filtres ou de rechercher autre chose.
                                </p>
                                <button
                                    onClick={resetFilters}
                                    className="mt-6 btn-primary py-2 px-6 text-sm"
                                >
                                    Voir tous les produits
                                </button>
                            </motion.div>
                        ) : (
                            <>
                                {/* Compteur et information de tri */}
                                <div className="flex items-center justify-between mb-6">
                                    <p className="text-sm text-gray-500">
                                        Affichage de <span className="font-semibold text-gray-700">{filteredProducts.length}</span> produits
                                    </p>
                                    <div className="hidden lg:flex items-center gap-2 text-sm text-gray-400">
                                        <Sparkles className="w-4 h-4 text-primary-400" />
                                        <span>
                                            Tri :{' '}
                                            {filters.sort === 'newest'
                                                ? 'Plus récents'
                                                : filters.sort === 'price_asc'
                                                    ? 'Prix croissant'
                                                    : 'Prix décroissant'}
                                        </span>
                                    </div>
                                </div>

                                {/* Grille de produits */}
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className={`grid gap-6 ${
                                        viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
                                    }`}
                                >
                                    <AnimatePresence>
                                        {filteredProducts.map((product) => (
                                            <motion.div
                                                key={product.id}
                                                variants={itemVariants}
                                                layout
                                                className={viewMode === 'list' ? 'grid' : ''}
                                            >
                                                <ProductCard product={product} viewMode={viewMode} />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </motion.div>

                                {/* Pagination (simulée) */}
                                {filteredProducts.length > 6 && (
                                    <div className="mt-12 flex justify-center">
                                        <nav className="flex items-center gap-2">
                                            <button className="px-3 py-1 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition">
                                                Précédent
                                            </button>
                                            <span className="px-4 py-1 rounded-lg bg-primary-500 text-white">1</span>
                                            <button className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                                                2
                                            </button>
                                            <button className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                                                3
                                            </button>
                                            <span className="text-gray-400">…</span>
                                            <button className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                                                Suivant
                                            </button>
                                        </nav>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}