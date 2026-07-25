'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProductForm from '@/app/admin/components/ProductForm';
import Link from "next/link";

interface ProductData {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    comparePrice?: number;
    category: string;
    subCategory?: string;
    images: string[];
    colors: string[];
    sizes: string[];
    stock: number;
    rating?: number;
    badge?: string;
    isFeatured: boolean;
    isNew: boolean;
}

export default function EditProductPage() {
    const params = useParams();
    const [product, setProduct] = useState<ProductData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/admin/products/${params.id}`);
                if (!res.ok) throw new Error('Produit non trouvé');
                const data = await res.json();
                setProduct(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [params.id]);

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">Chargement...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500">{error || 'Produit introuvable'}</p>
                <Link href="/admin/products" className="btn-primary mt-4 inline-block">
                    Retour à la liste
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl md:text-3xl font-serif text-gray-800">
                    Modifier : {product.name}
                </h1>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <ProductForm initialData={product} productId={product.id} isEditing />
            </div>
        </div>
    );
}