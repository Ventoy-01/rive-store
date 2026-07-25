import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
    request: NextRequest,
    { params }:
    { params:
            Promise<{ slug:
                    string }> }
) {
    try {
        // Attendre la résolution de la promesse
        const { slug } = await params;

        if (!slug) {
            return NextResponse.json(
                { error: 'Slug manquant' },
                { status: 400 }
            );
        }

        const cleanSlug = slug.toLowerCase().trim();

        const product = await prisma.product.findUnique({
            where: { slug: cleanSlug },
        });

        if (!product) {
            return NextResponse.json(
                { error: 'Produit non trouvé' },
                { status: 404 }
            );
        }

        const safeProduct = {
            ...product,
            images: Array.isArray(product.images) ? product.images : [],
            colors: Array.isArray(product.colors) ? product.colors : [],
            sizes: Array.isArray(product.sizes) ? product.sizes : [],
        };

        return NextResponse.json(safeProduct);
    } catch (error) {
        console.error('❌ Erreur:', error);
        return NextResponse.json(
            { error: 'Erreur interne', details: String(error) },
            { status: 500 }
        );
    }
}