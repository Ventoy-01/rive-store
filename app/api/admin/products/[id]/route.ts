import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';

const prisma = new PrismaClient();

// GET : récupérer un produit
export async function GET(
    request: NextRequest,
    { params }:
    { params:
            Promise<{ id:
                    string }> }
) {
    try {
        const { id } = await params;

        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const product = await prisma.product.findUnique({
            where: { id: id },
        });

        if (!product) {
            return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('GET product error:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération du produit' },
            { status: 500 }
        );
    }
}

// PUT : mettre à jour un produit
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const body = await request.json();
        const {id} = await params;

        const product = await prisma.product.update({
            where: { id: id },
            data: body,
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error('PUT product error:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la mise à jour du produit' },
            { status: 500 }
        );
    }
}

// DELETE : supprimer un produit
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }
        const {id} = await params;

        await prisma.product.delete({
            where: { id: id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE product error:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la suppression du produit' },
            { status: 500 }
        );
    }
}