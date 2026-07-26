'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shirt, Droplets, Footprints, Package } from 'lucide-react';

import Footer from '@/app/components/Footer';
import ProductCard from '@/app/components/ProductCard';
import Newsletter from '@/app/components/Newsletter';
import Image from 'next/image';
import NavbarWrapper from "@/app/components/NavbarWrapper";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  images: string[];
  rating: number;
  badge: string | null;
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products?featured=true&limit=6')
      .then(res => res.json())
      .then(data => {
        setFeaturedProducts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar - visible sur la page d'accueil */}
      <NavbarWrapper />

      <main className="flex-grow m-2">
        {/* Hero Section avec image de fond et fallback */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-r from-primary-50 to-accent-50">
          {/* Image de fond */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero/hero_1.jpg"
              alt="Hero background"
              fill
              className="object-cover"
              priority
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* Contenu */}
          <div className="relative container-custom text-center z-10">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 animate-fade-in">
              RiveStore
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              L'élégance à portée de main — Découvrez notre collection unique
            </p>
            <Link href="/products" className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block">
              Explorer la collection →
            </Link>
          </div>
        </section>


        {/* Featured Products */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif text-primary-700 mb-4">
                Nos incontournables
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Découvrez les pièces préférées de notre communauté
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-80 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-20 bg-primary-50">
                           <div className="container-custom">
                             <h2 className="text-3xl md:text-4xl font-serif text-primary-700 text-center mb-12">
                                  Nos catégories
                               </h2>
                               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                   {[
                             { name: 'Vêtements', icon: Shirt, color: 'bg-pink-100', category: 'VETEMENTS' },
                             { name: 'Cosmétiques', icon: Droplets, color: 'bg-rose-100', category: 'COSMETIQUES' },
                             { name: 'Sandales', icon: Footprints, color: 'bg-amber-100', category: 'SANDALES' },
                             { name: 'Accessoires', icon: Package, color: 'bg-purple-100', category: 'ACCESSOIRES' },
                         ].map((cat) => {
                             const Icon = cat.icon;
                             return (
                                 <Link
                                     key={cat.name}
                                     href={`/products?category=${cat.category}`}
                                    className={`${cat.color} rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300 flex flex-col items-center`}
                                 >
                                     <Icon className="w-14 h-14 text-primary-600 mb-3" strokeWidth={1.5} />
                                     <h3 className="font-semibold text-gray-800">{cat.name}</h3>
                                 </Link>
                             );
                       })}
                     </div>
                </div>
             </section>


        {/* Newsletter */}
        <Newsletter />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}