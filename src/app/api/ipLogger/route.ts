import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const forwarded = req.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0] : 'IP non disponible';
        const userAgent = req.headers.get('user-agent') || 'Unknown';

        // Si l'IP est disponible, faire une requête à ipapi pour récupérer la localisation
        let locationData = null;
        if (ip && ip !== 'IP non disponible') {
            const response = await fetch(`https://ipapi.co/${ip}/json/`);
            locationData = await response.json();
        }

        // Configuration de Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER, // Assurez-vous d'avoir ajouté cette variable dans .env.local
                pass: process.env.GMAIL_PASS, // Utilisez un mot de passe d'application Gmail
            },
        });

        // Préparer les informations de localisation
        const locationInfo = locationData ? `
            Pays: ${locationData.country_name}
            Région: ${locationData.region}
            Ville: ${locationData.city}
            Code postal: ${locationData.postal}
            Latitude: ${locationData.latitude}
            Longitude: ${locationData.longitude}
            FAI: ${locationData.org}
        ` : 'Localisation non disponible';

        // Contenu de l'e-mail
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: 'leo0609leo@gmail.com', // Changez par votre adresse e-mail
            subject: `Nouvelle adresse IP : ${ip}`,
            text: `L'utilisateur a donné son consentement.\n
            Adresse IP: ${ip}\n
            User-Agent: ${userAgent}\n
            Localisation:\n${locationInfo}`,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: 'E-mail envoyé avec succès' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Erreur lors de l\'envoi de l\'e-mail' }, { status: 500 });
    }
}
