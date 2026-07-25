import Link from 'next/link';
import { Flower, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-primary-900 text-white mt-auto">
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Flower className="w-7 h-7 text-primary-300" strokeWidth={1.5} />
                            <span className="font-serif text-2xl font-bold">RiveStore</span>
                        </div>
                        <p className="text-primary-200 text-sm">
                            L'élégance à portée de main. Découvrez notre collection unique de vêtements, cosmétiques et accessoires.
                        </p>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Liens rapides</h3>
                        <ul className="space-y-2 text-primary-200">
                            <li><Link href="/products" className="hover:text-white transition">Boutique</Link></li>
                            <li><Link href="/about" className="hover:text-white transition">À propos</Link></li>
                            {/* ✅ Lien Contact va vers /about#contact */}
                            <li><Link href="/about#contact" className="hover:text-white transition">Contact</Link></li>
                            <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Catégories</h3>
                        <ul className="space-y-2 text-primary-200">
                            <li><Link href="/products?category=VETEMENTS" className="hover:text-white transition">Vêtements</Link></li>
                            <li><Link href="/products?category=COSMETIQUES" className="hover:text-white transition">Cosmétiques</Link></li>
                            <li><Link href="/products?category=SANDALES" className="hover:text-white transition">Sandales</Link></li>
                            <li><Link href="/products?category=ACCESSOIRES" className="hover:text-white transition">Accessoires</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Contact</h3>
                        <ul className="space-y-3 text-primary-200">
                            <li className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-primary-400 shrink-0" strokeWidth={1.5} />
                                <span>contact@rivestore.com</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-primary-400 shrink-0" strokeWidth={1.5} />
                                <span>+33 1 23 45 67 89</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <MapPin className="w-4 h-4 text-primary-400 shrink-0" strokeWidth={1.5} />
                                <span>Paris, France</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-primary-800 mt-8 pt-8 text-center text-primary-300 text-sm">
                    <p>&copy; 2024 RiveStore. Tous droits réservés. L'élégance intemporelle.</p>
                </div>
            </div>
        </footer>
    );
}