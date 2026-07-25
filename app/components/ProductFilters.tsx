'use client';

interface ProductFiltersProps {
    filters: {
        category: string;
        minPrice: string;
        maxPrice: string;
        sort: string;
    };
    setFilters: (filters: any) => void;
}

export default function ProductFilters({ filters, setFilters }: ProductFiltersProps) {
    const categories = [
        { value: 'all', label: 'Tous' },
        { value: 'VETEMENTS', label: 'Vêtements' },
        { value: 'COSMETIQUES', label: 'Cosmétiques' },
        { value: 'SANDALES', label: 'Sandales' },
        { value: 'ACCESSOIRES', label: 'Accessoires' },
    ];

    const sortOptions = [
        { value: 'newest', label: 'Plus récents' },
        { value: 'price_asc', label: 'Prix croissant' },
        { value: 'price_desc', label: 'Prix décroissant' },
        { value: 'rating', label: 'Mieux notés' },
    ];

    return (
        <div className="bg-primary-50 rounded-2xl p-6">
            <h3 className="font-serif text-xl mb-4">Filtres</h3>

            {/* Categories */}
            <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Catégories</label>
                <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full p-2 rounded-lg border border-primary-200 focus:border-primary-500 focus:outline-none"
                >
                    {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                </select>
            </div>

            {/* Price range */}
            <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Prix</label>
                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                        className="w-1/2 p-2 rounded-lg border border-primary-200"
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                        className="w-1/2 p-2 rounded-lg border border-primary-200"
                    />
                </div>
            </div>

            {/* Sort */}
            <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Trier par</label>
                <select
                    value={filters.sort}
                    onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                    className="w-full p-2 rounded-lg border border-primary-200 focus:border-primary-500 focus:outline-none"
                >
                    {sortOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            {/* Reset */}
            <button
                onClick={() => setFilters({ category: 'all', minPrice: '', maxPrice: '', sort: 'newest' })}
                className="w-full text-center text-primary-600 hover:text-primary-700 text-sm"
            >
                Réinitialiser les filtres
            </button>
        </div>
    );
}