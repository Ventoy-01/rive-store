'use client';

import { useCart } from '@/app/lib/cart-context';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
    const { cart, updateQuantity, removeFromCart, total } = useCart();

    if (cart.length === 0) {
        return (
            <div className="container-custom py-20 text-center">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-2xl font-serif mb-4">Votre panier est vide</h2>
                <p className="text-gray-600 mb-8">Découvrez notre collection et trouvez votre bonheur</p>
                <Link href="/products" className="btn-primary">
                    Explorer les produits
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white py-12 m-2">
            <div className="container-custom">
                <h1 className="text-3xl font-serif text-primary-700 mb-8 mt-8">Mon panier</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart items */}
                    <div className="lg:col-span-2">
                        {cart.map((item) => (
                            <div key={`${item.productId}-${item.color}-${item.size}`}
                                 className="flex gap-4 py-4 border-b border-gray-200">
                                <div className="w-24 h-24 bg-primary-50 rounded-lg overflow-hidden">
                                    <img src={item.image} alt={item.name} width={96} height={96} className="object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                    {item.color && <p className="text-sm text-gray-500">Couleur: {item.color}</p>}
                                    {item.size && <p className="text-sm text-gray-500">Taille: {item.size}</p>}
                                    <p className="text-primary-600 font-semibold">{item.price}€</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="w-8 h-8 rounded-full border border-gray-300"
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="w-8 h-8 rounded-full border border-gray-300"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-red-500 text-sm hover:text-red-600"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-primary-50 rounded-2xl p-6 sticky top-24">
                            <h3 className="text-xl font-serif mb-4">Récapitulatif</h3>
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between">
                                    <span>Sous-total</span>
                                    <span>{total()}€</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Livraison</span>
                                    <span>Calculé à l'étape suivante</span>
                                </div>
                            </div>
                            <div className="border-t border-primary-200 pt-4 mb-6">
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>{total()}€</span>
                                </div>
                            </div>
                            <Link href="#" className="btn-primary w-full text-center block">
                                Procéder au paiement
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}