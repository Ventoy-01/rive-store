import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log(' Seed database...');

    // Admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
        where: { email: 'admin@rivestore.com' },
        update: {},
        create: {
            email: 'admin@rivestore.com',
            password: hashedPassword,
            name: 'Admin RiveStore',
            role: 'ADMIN',
        },
    });
    console.log('Admin créé');

    // Products
    const products = [
        {
            name: "Robe Fleurie Élégante",
            slug: "robe-fleurie-elegante",
            description: "Robe longue en soie avec motif floral, parfaite pour les occasions spéciales.",
            price: 129.99,
            comparePrice: 199.99,
            category: "VETEMENTS",
            images: ["/images/products/robe-1.jpg"],
            colors: ["Rose", "Blanc", "Bleu"],
            sizes: ["XS", "S", "M", "L", "XL"],
            stock: 25,
            rating: 4.8,
            badge: "NOUVEAU",
            isFeatured: true,
            isNew: true,
        },
        {
            name: "Sandales Perles",
            slug: "sandales-perles",
            description: "Sandales élégantes ornées de perles, semelle confortable.",
            price: 89.99,
            comparePrice: 129.99,
            category: "SANDALES",
            images: ["/images/products/sandales-1.jpg"],
            colors: ["Doré", "Argent", "Rose"],
            sizes: ["35", "36", "37", "38", "39", "40"],
            stock: 40,
            rating: 4.9,
            badge: "BEST_SELLER",
            isFeatured: true,
            isNew: false,
        },
        {
            name: "Kit Soin Visage",
            slug: "kit-soin-visage",
            description: "Kit complet de soin visage bio, 4 produits naturels.",
            price: 59.99,
            comparePrice: 89.99,
            category: "COSMETIQUES",
            images: ["/images/products/soin-1.jpg"],
            colors: ["Naturel"],
            sizes: [],
            stock: 60,
            rating: 4.7,
            badge: "PROMO",
            isFeatured: true,
            isNew: false,
        },
        {
            name: "Sac à Main Tressé",
            slug: "sac-main-tresse",
            description: "Sac à main artisanal en paille tressée, doublure en coton.",
            price: 79.99,
            category: "ACCESSOIRES",
            images: ["/images/products/sac-1.jpg"],
            colors: ["Naturel", "Noir", "Beige"],
            sizes: ["Unique"],
            stock: 30,
            rating: 4.6,
            badge: null,
            isFeatured: true,
            isNew: false,
        },
    ];

    for (const product of products) {
        await prisma.product.upsert({
            where: { slug: product.slug },
            update: {},
            create: product,
        });
        console.log(`✓ Produit importé: ${product.name}`);
    }

    console.log('✅ Seed completed!');
}

main()
    .catch(e => {
        console.error('❌ Error seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });