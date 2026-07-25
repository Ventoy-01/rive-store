'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import { useCart } from '@/app/lib/cart-context';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    comparePrice: number | null;
    images: string[]; // Maintenant toujours un tableau (éventuellement vide)
    colors: string[];
    sizes: string[];
    stock: number;
    rating: number;
    category: string;
}

export default function ProductDetailPage() {
    const params = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        fetch(`/api/products/${params.slug}`)
            .then((res) => {
                if (!res.ok) throw new Error('Produit non trouvé');
                return res.json();
            })
            .then((data) => {
                // S'assurer que images est toujours un tableau
                const productWithDefaults = {
                    ...data,
                    images: Array.isArray(data.images) ? data.images : [],
                    colors: Array.isArray(data.colors) ? data.colors : [],
                    sizes: Array.isArray(data.sizes) ? data.sizes : [],
                };
                setProduct(productWithDefaults);
                if (productWithDefaults.colors.length) setSelectedColor(productWithDefaults.colors[0]);
                if (productWithDefaults.sizes.length) setSelectedSize(productWithDefaults.sizes[0]);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
                setProduct(null);
            });
    }, [params.slug]);

    const handleAddToCart = async () => {
        if (!product || product.stock === 0) return;
        setAddingToCart(true);
        await addToCart({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
            color: selectedColor,
            size: selectedSize,
            image: product.images?.[0] || '/images/placeholder.jpg',
        });
        setAddingToCart(false);
    };

    if (loading) {
        return (
            <div className="container-custom py-12">
                <div className="animate-pulse">
                    <div className="bg-gray-200 h-96 rounded-lg mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container-custom py-12 text-center">
                <h2 className="text-2xl font-serif mb-4">Produit non trouvé</h2>
                <Link href="/products" className="btn-primary">
                    Voir tous les produits
                </Link>
            </div>
        );
    }

    // Image par défaut si aucune image n'est fournie
    const mainImage = product.images?.[selectedImage] || '/images/placeholder.jpg';
    const hasImages = product.images && product.images.length > 1;

    return (
        <div className="bg-white py-12 mt-5">
            <div className="container-custom">
                {/* Breadcrumb - Navigasyon */}
                <div className="mb-10">
                    <nav className="text-sm text-gray-500 mb-3" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2">
                            <li>
                                <Link href="/" className="hover:text-primary-600 transition">
                                    Accueil
                                </Link>
                            </li>
                            <li className="text-gray-300">/</li>
                            <li>
                                <Link href="/products" className="hover:text-primary-600 transition">
                                    Boutique
                                </Link>
                            </li>
                            <li className="text-gray-300">/</li>
                            <li className="text-primary-600 font-medium truncate max-w-[200px]">
                                {product.name}
                            </li>
                        </ol>
                    </nav>
                </div>
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div>
                        <div className="bg-primary-50 rounded-2xl overflow-hidden mb-4 relative aspect-square">
                            <img
                                src={mainImage}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />

                        </div>
                        {hasImages && (
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition flex-shrink-0 ${
                                            selectedImage === idx ? 'border-primary-500' : 'border-transparent hover:border-gray-300'
                                        }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.name} ${idx + 1}`}
                                            width={80}
                                            height={80}
                                            className="object-cover w-full h-full"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        <div className="mb-6">
              <span className="text-sm text-primary-500 uppercase tracking-wide">
                {product.category || 'Catégorie'}
              </span>
                            <h1 className="text-3xl md:text-4xl font-serif text-primary-700 mt-2 mb-4">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-primary-600">
                  {product.price}€
                </span>
                                {product.comparePrice && (
                                    <span className="text-gray-400 line-through text-xl">
                    {product.comparePrice}€
                  </span>
                                )}
                            </div>
                            <p className="text-gray-600 leading-relaxed">{product.description}</p>
                        </div>

                        {/* Colors */}
                        {product.colors && product.colors.length > 0 && (
                            <div className="mb-6">
                                <h3 className="font-semibold mb-3">Couleurs</h3>
                                <div className="flex gap-3 flex-wrap">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-10 h-10 rounded-full border-2 transition ${
                                                selectedColor === color ? 'border-primary-500 scale-110' : 'border-gray-300'
                                            }`}
                                            style={{ backgroundColor: color.toLowerCase() }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sizes */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div className="mb-6">
                                <h3 className="font-semibold mb-3">Tailles</h3>
                                <div className="flex gap-3 flex-wrap">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 rounded-lg border transition ${
                                                selectedSize === size
                                                    ? 'bg-primary-500 text-white border-primary-500'
                                                    : 'border-gray-300 hover:border-primary-400'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="mb-6">
                            <h3 className="font-semibold mb-3">Quantité</h3>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 rounded-full border border-gray-300 hover:border-primary-400 flex items-center justify-center transition"
                                    aria-label="Diminuer la quantité"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="text-xl w-12 text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-10 rounded-full border border-gray-300 hover:border-primary-400 flex items-center justify-center transition"
                                    aria-label="Augmenter la quantité"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                                <span className="text-sm text-gray-500 ml-2">
                  Stock: {product.stock} disponibles
                </span>
                            </div>
                        </div>

                        {/* Add to cart */}
                        <button
                            onClick={handleAddToCart}
                            disabled={addingToCart || product.stock === 0}
                            className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {addingToCart ? 'Ajout en cours...' : 'Ajouter au panier'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}