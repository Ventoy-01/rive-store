import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const body = await request.json();

        // Stockage temporaire - en production, utiliser Redis ou base de données
        // Pour l'instant, le panier est géré côté client

        return NextResponse.json({ success: true, data: body });
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de l\'ajout au panier' },
            { status: 500 }
        );
    }
}