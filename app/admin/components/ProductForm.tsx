'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, X, Link as LinkIcon } from 'lucide-react';

interface ProductFormData {
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

interface ProductFormProps {
    initialData?: ProductFormData;
    productId?: string;
    isEditing?: boolean;
}

const categories = [
    { value: 'VETEMENTS', label: 'Vêtements' },
    { value: 'COSMETIQUES', label: 'Cosmétiques' },
    { value: 'SANDALES', label: 'Sandales' },
    { value: 'ACCESSOIRES', label: 'Accessoires' },
];

const badgeOptions = [
    { value: '', label: 'Aucun' },
    { value: 'NOUVEAU', label: 'Nouveau' },
    { value: 'PROMO', label: 'Promo' },
    { value: 'BEST_SELLER', label: 'Best-seller' },
    { value: 'LIMITED', label: 'Édition limitée' },
];

export default function ProductForm({ initialData, productId, isEditing }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // État du formulaire
    const [formData, setFormData] = useState<ProductFormData>({
        name: initialData?.name || '',
        slug: initialData?.slug || '',
        description: initialData?.description || '',
        price: initialData?.price || 0,
        comparePrice: initialData?.comparePrice || undefined,
        category: initialData?.category || 'VETEMENTS',
        subCategory: initialData?.subCategory || '',
        images: initialData?.images?.length ? initialData.images : [''],
        colors: initialData?.colors?.length ? initialData.colors : [''],
        sizes: initialData?.sizes?.length ? initialData.sizes : [''],
        stock: initialData?.stock || 0,
        rating: initialData?.rating || 0,
        badge: initialData?.badge || '',
        isFeatured: initialData?.isFeatured || false,
        isNew: initialData?.isNew || false,
    });

    // Gestion des champs tableau (images, couleurs, tailles)
    const handleArrayChange = (
        field: 'images' | 'colors' | 'sizes',
        index: number,
        value: string
    ) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData({ ...formData, [field]: newArray });
    };

    const addArrayItem = (field: 'images' | 'colors' | 'sizes') => {
        setFormData({ ...formData, [field]: [...formData[field], ''] });
    };

    const removeArrayItem = (field: 'images' | 'colors' | 'sizes', index: number) => {
        if (formData[field].length <= 1) return;
        const newArray = formData[field].filter((_, i) => i !== index);
        setFormData({ ...formData, [field]: newArray });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Nettoyer les tableaux (enlever les champs vides)
        const cleanData = {
            ...formData,
            images: formData.images.filter((img) => img.trim() !== ''),
            colors: formData.colors.filter((c) => c.trim() !== ''),
            sizes: formData.sizes.filter((s) => s.trim() !== ''),
            badge: formData.badge || null,  // Si vide, envoyer null
        };

        // Slug auto-généré si vide
        if (!cleanData.slug) {
            cleanData.slug = cleanData.name
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
        }

        const url = isEditing ? `/api/admin/products/${productId}` : '/api/admin/products';
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cleanData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Erreur lors de l\'enregistrement');
            }

            router.push('/admin/products');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Erreur */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nom */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom du produit *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:outline-none"
                        placeholder="Robe élégante"
                    />
                </div>

                {/* Slug */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Slug (URL)
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:outline-none"
                            placeholder="robe-elegante"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                const slug = formData.name
                                    .toLowerCase()
                                    .normalize('NFD')
                                    .replace(/[\u0300-\u036f]/g, '')
                                    .replace(/[^a-z0-9]+/g, '-')
                                    .replace(/^-+|-+$/g, '');
                                setFormData({ ...formData, slug });
                            }}
                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm whitespace-nowrap"
                        >
                            Générer
                        </button>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                </label>
                <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:outline-none"
                    placeholder="Description du produit..."
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Prix */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prix (€) *
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        required
                        min="0"
                        value={formData.price || ''}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:outline-none"
                        placeholder="29.99"
                    />
                </div>

                {/* Prix barré */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prix barré (€)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.comparePrice || ''}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                comparePrice: e.target.value ? parseFloat(e.target.value) : undefined,
                            })
                        }
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:outline-none"
                        placeholder="39.99"
                    />
                </div>

                {/* Stock */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock *
                    </label>
                    <input
                        type="number"
                        required
                        min="0"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:outline-none"
                        placeholder="10"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Catégorie */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Catégorie *
                    </label>
                    <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:outline-none"
                    >
                        {categories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Badge - Liste déroulante */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Badge
                    </label>
                    <select
                        value={formData.badge || ''}
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value || undefined })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:outline-none"
                    >
                        {badgeOptions.map((badge) => (
                            <option key={badge.value} value={badge.value}>
                                {badge.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Images */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Images (URLs)
                </label>
                {formData.images.map((img, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={img}
                            onChange={(e) => handleArrayChange('images', index, e.target.value)}
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:outline-none"
                            placeholder="https://exemple.com/image.jpg"
                        />
                        <button
                            type="button"
                            onClick={() => removeArrayItem('images', index)}
                            className="px-3 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => addArrayItem('images')}
                    className="text-sm text-primary-600 hover:text-primary-700 transition"
                >
                    + Ajouter une image
                </button>
            </div>

            {/* Couleurs */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Couleurs
                </label>
                {formData.colors.map((color, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={color}
                            onChange={(e) => handleArrayChange('colors', index, e.target.value)}
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:outline-none"
                            placeholder="Rouge"
                        />
                        <button
                            type="button"
                            onClick={() => removeArrayItem('colors', index)}
                            className="px-3 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => addArrayItem('colors')}
                    className="text-sm text-primary-600 hover:text-primary-700 transition"
                >
                    + Ajouter une couleur
                </button>
            </div>

            {/* Tailles */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tailles
                </label>
                {formData.sizes.map((size, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={size}
                            onChange={(e) => handleArrayChange('sizes', index, e.target.value)}
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:outline-none"
                            placeholder="M"
                        />
                        <button
                            type="button"
                            onClick={() => removeArrayItem('sizes', index)}
                            className="px-3 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => addArrayItem('sizes')}
                    className="text-sm text-primary-600 hover:text-primary-700 transition"
                >
                    + Ajouter une taille
                </button>
            </div>

            {/* Options - Checkbox */}
            <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">⭐ En vedette</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={formData.isNew}
                        onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">✨ Nouveau</span>
                </label>
            </div>

            {/* Boutons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center gap-2 px-6 py-2.5 disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    {loading ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Créer le produit'}
                </button>
                <Link
                    href="/admin/products"
                    className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-center"
                >
                    Annuler
                </Link>
            </div>
        </form>
    );
}