import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {

        const { userId } = await params;

        // Vérifier la session
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        if (!userId) {
            return NextResponse.json(
                { error: 'ID utilisateur manquant' },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                _count: {
                    select: { orders: true },
                },
                orders: {
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: `Utilisateur non trouvé avec l'ID: ${userId}` },
                { status: 404 }
            );
        }

        const { password, ...userWithoutPassword } = user;
        return NextResponse.json(userWithoutPassword);
    } catch (error: any) {
        console.error('❌ Erreur:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération' },
            { status: 500 }
        );
    }
}

// ✅ CORRECTION pour PATCH aussi
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params;

        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const body = await request.json();
        const { name, email, role, password } = body;

        // Vérifier si l'email existe déjà
        if (email) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    email,
                    NOT: { id: userId },
                },
            });
            if (existingUser) {
                return NextResponse.json(
                    { error: 'Cet email est déjà utilisé' },
                    { status: 400 }
                );
            }
        }

        const data: any = {};
        if (name !== undefined) data.name = name;
        if (email) data.email = email;
        if (role && ['ADMIN', 'USER'].includes(role)) data.role = role;
        if (password) {
            data.password = await bcrypt.hash(password, 10);
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data,
        });

        const { password: _, ...userWithoutPassword } = user;
        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la mise à jour' },
            { status: 500 }
        );
    }
}

// ✅ CORRECTION pour DELETE aussi
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params;

        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        if (userId === session.user.id) {
            return NextResponse.json(
                { error: 'Vous ne pouvez pas supprimer votre propre compte' },
                { status: 400 }
            );
        }

        await prisma.user.delete({
            where: { id: userId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la suppression' },
            { status: 500 }
        );
    }
}