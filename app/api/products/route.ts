import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const category = searchParams.get('category');
        const featured = searchParams.get('featured') === 'true';
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const sort = searchParams.get('sort') || 'newest';
        const limit = parseInt(searchParams.get('limit') || '12');
        const search = searchParams.get('search');
        const isNew = searchParams.get('isNew') === 'true';
        const badge = searchParams.get('badge');

        let where: any = {};

        if (category && category !== 'all') {
            where.category = category;
        }

        if (featured) {
            where.isFeatured = true;
        }

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = parseFloat(minPrice);
            if (maxPrice) where.price.lte = parseFloat(maxPrice);
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (isNew) {
            where.isNew = true;
        }
        console.log('where:', where);

        if (badge) {
            where.badge = badge;
        }

        let orderBy: any = {};
        switch (sort) {
            case 'price_asc':
                orderBy = { price: 'asc' };
                break;
            case 'price_desc':
                orderBy = { price: 'desc' };
                break;
            case 'rating':
                orderBy = { rating: 'desc' };
                break;
            default:
                orderBy = { createdAt: 'desc' };
        }

        const products = await prisma.product.findMany({
            where,
            orderBy,
            take: limit,
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des produits' },
            { status: 500 }
        );
    }
}