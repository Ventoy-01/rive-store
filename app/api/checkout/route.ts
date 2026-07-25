import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendOrderConfirmationEmail } from '@/app/lib/email';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, address, city, postalCode, country, phone, items, total } = body;

        // Générer un numéro de commande unique
        const orderNumber = `RV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Créer la commande
        const order = await prisma.order.create({
            data: {
                orderNumber,
                email,
                phone,
                address,
                city,
                postalCode,
                country,
                total,
                status: 'PENDING',
                items: {
                    create: items.map((item: any) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                        size: item.size,
                        color: item.color,
                    })),
                },
            },
        });

        // Envoyer l'email de confirmation
        await sendOrderConfirmationEmail(email, order, items);

        // Mettre à jour le stock
        for (const item of items) {
            await prisma.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } },
            });
        }

        return NextResponse.json({ success: true, orderId: order.id, orderNumber });
    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la validation de la commande' },
            { status: 500 }
        );
    }
}