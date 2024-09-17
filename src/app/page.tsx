"use client"
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

export default function Home() {
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const logIp = async () => {
            try {
                const response = await fetch('/api/ipLogger', {
                    method: 'POST',
                });

                if (response.ok) {
                    setError('');
                    // Créer un lien pour télécharger le fichier
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'JeVousAiEu.txt'; // Nom du fichier à télécharger
                    document.body.appendChild(a);
                    a.click(); // Simuler un clic pour télécharger automatiquement le fichier
                    a.remove(); // Supprimer l'élément du DOM une fois que le fichier est téléchargé

                    // Ajouter un petit délai avant de rediriger pour s'assurer que le fichier est téléchargé
                    setTimeout(() => {
                        router.push('https://portfolio-leo-vercel.vercel.app/');
                    }, 1000);  // 1 seconde de délai
                } else {
                    setError('Une erreur est survenue lors de l\'envoi.');
                }

            } catch (error) {
                setError('Une erreur est survenue lors de la requête.');
            }
        };

        logIp();
    }, [error, router]);

    return (
        <div>
            {error && <p>{error}</p>}
        </div>
    );
}
