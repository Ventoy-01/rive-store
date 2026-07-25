'use client';

import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        slug: string;
        price: number;
        viewMode?: 'grid' | 'list';
        comparePrice: number | null;
        images: string[];
        rating: number;
        badge: string | null;
        isNew?: boolean;
        isFeatured?: boolean;
    };
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <Link href={`/products/${product.slug}`} className="group">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 card-hover">
                {/* Image */}
                <div className="relative h-80 overflow-hidden bg-primary-50">
                    <Image
                        src={product.images[0] || '/images/placeholder.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* === BADGES === */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {/* 1. Badge principal (PROMO, NOUVEAU, BEST_SELLER) - KOULE AKTIV (or) */}
                        {product.badge && (
                            <span className="bg-accent-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                                {product.badge === 'NOUVEAU' ? 'Nouveau' :
                                    product.badge === 'PROMO' ? 'Promo' :
                                        product.badge === 'BEST_SELLER' ? 'Best-seller' :
                                            product.badge === 'LIMITED' ? 'Édition limitée' :
                                                product.badge}
                            </span>
                        )}

                        {/* 2. Badge isNew - VÈ (si li pa deja gen badge NOUVEAU) */}
                        {product.isNew && !product.badge?.includes('NOUVEAU') && (
                            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                                ✨ Nouveau
                            </span>
                        )}

                        {/* 3. Badge isFeatured - BLÈ */}
                        {product.isFeatured && (
                            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                                ⭐ En vedette
                            </span>
                        )}
                    </div>
                </div>

                {/* Info */}
                <div className="p-4">
                    <h3 className="font-semibold text-gray-800 group-hover:text-primary-600 transition mb-1">
                        {product.name}
                    </h3>

                    <div className="flex items-center gap-1 mb-2">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm text-gray-600">{product.rating || 0}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-primary-600">{product.price}€</span>
                        {product.comparePrice && (
                            <span className="text-gray-400 line-through text-sm">{product.comparePrice}€</span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}