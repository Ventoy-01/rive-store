import { Inter, Playfair_Display } from 'next/font/google';
import { Providers } from '@/app/providers';
import { CartProvider } from '@/app/lib/cart-context';
import type { Metadata } from 'next';
import './globals.css';


// Configuration avec chemins explicites
const inter = Inter({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-inter',
    display: 'swap',
});

const playfair = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-playfair',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'RiveStore - Boutique Élégante',
    description: 'Découvrez notre collection de vêtements, cosmétiques et accessoires raffinés',
    keywords: 'mode, beauté, sandales, accessoires, boutique en ligne',
    authors: [{ name: 'RiveStore' }],
    openGraph: {
        title: 'RiveStore - Boutique Élégante',
        description: 'Collection raffinée pour femmes élégantes',
        type: 'website',
        locale: 'fr_FR',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
            <body className="font-sans antialiased">
                <Providers>
                    <CartProvider>
                        {children}
                    </CartProvider>
                </Providers>
            </body>
        </html>
    );
}