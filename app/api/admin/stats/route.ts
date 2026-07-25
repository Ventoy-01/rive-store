import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const [totalProducts, totalOrders, totalUsers, orders] = await Promise.all([
            prisma.product.count(),
            prisma.order.count(),
            prisma.user.count(),
            prisma.order.findMany({
                select: { total: true },
                where: { status: 'DELIVERED' },
            }),
        ]);

        const revenue = orders.reduce((sum, o) => sum + o.total, 0);

        // Calcul des variations (simulé pour l'exemple)
        const revenueChange = 12.5;
        const ordersChange = 8.3;

        return NextResponse.json({
            totalProducts,
            totalOrders,
            totalUsers,
            revenue,
            revenueChange,
            ordersChange,
        });
    } catch (error) {
        console.error('Stats error:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des statistiques' },
            { status: 500 }
        );
    }
}