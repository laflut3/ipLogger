import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const forwarded = req.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0] : 'IP non disponible';  // Remplacer la méthode req.socket
        const userAgent = req.headers.get('user-agent') || 'Unknown';

        // Configuration de Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER, // Assurez-vous d'avoir ajouté cette variable dans .env.local
                pass: process.env.GMAIL_PASS, // Utilisez un mot de passe d'application Gmail
            },
        });

        // Contenu de l'e-mail
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: 'leo0609leo@gmail.com', // Changez par votre adresse e-mail
            subject: "" + {ip},
            text: `L'utilisateur a donné son consentement.\nAdresse IP: ${ip}\nUser-Agent: ${userAgent}`,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: 'E-mail envoyé avec succès' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Erreur lors de l\'envoi de l\'e-mail' }, { status: 500 });
    }
}

