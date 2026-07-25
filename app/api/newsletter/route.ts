import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: 'Email invalide' },
                { status: 400 }
            );
        }

        const subscriber = await prisma.newsletterSubscriber.upsert({
            where: { email },
            update: {},
            create: { email },
        });

        return NextResponse.json({ success: true, message: 'Inscription réussie !' });
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de l\'inscription' },
            { status: 500 }
        );
    }
}