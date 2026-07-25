import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
});

export async function sendOrderConfirmationEmail(email: string, order: any, items: any[]) {
    const html = `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #F7E9E6;">
      <div style="text-align: center; padding: 20px; background: white; border-radius: 20px;">
        <h1 style="color: #B06D85; font-family: 'Playfair Display', serif;">RiveStore 🌸</h1>
        <h2 style="color: #834054;">Confirmation de commande</h2>
        <p>Merci pour votre commande !</p>
        <p><strong>Commande #${order.orderNumber}</strong></p>
        
        <div style="text-align: left; margin: 20px 0;">
          <h3>Détails de la commande :</h3>
          ${items.map((item: any) => `
            <div style="border-bottom: 1px solid #E6C8A0; padding: 10px 0;">
              <p><strong>${item.name}</strong> x ${item.quantity} - ${item.price}€</p>
              ${item.size ? `<p>Taille: ${item.size}</p>` : ''}
              ${item.color ? `<p>Couleur: ${item.color}</p>` : ''}
            </div>
          `).join('')}
          
          <p style="font-size: 1.2em; margin-top: 20px;">
            <strong>Total: ${order.total}€</strong>
          </p>
        </div>
        
        <p>Vous recevrez un email de confirmation d'expédition dès que votre commande sera prête.</p>
        <p>À très bientôt sur RiveStore !</p>
      </div>
    </div>
  `;

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Confirmation de commande #${order.orderNumber} - RiveStore`,
        html,
    });
}

export async function sendWelcomeEmail(email: string, name?: string) {
    const html = `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #F7E9E6;">
      <div style="text-align: center; padding: 20px; background: white; border-radius: 20px;">
        <h1 style="color: #B06D85; font-family: 'Playfair Display', serif;">Bienvenue chez RiveStore ! 🌸</h1>
        <p>Bonjour ${name || 'cher client'},</p>
        <p>Nous sommes ravis de vous compter parmi nos clients.</p>
        <p>Découvrez notre collection exclusive de produits élégants.</p>
        <a href="${process.env.NEXTAUTH_URL}/products" style="display: inline-block; background: #B06D85; color: white; padding: 10px 20px; border-radius: 10px; text-decoration: none; margin-top: 20px;">
          Explorer la boutique
        </a>
      </div>
    </div>
  `;

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Bienvenue chez RiveStore - Votre code promo de bienvenue',
        html,
    });
}