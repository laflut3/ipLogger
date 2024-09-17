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
                    router.push('https://portfolio-leo-vercel.vercel.app/');
                } else {
                    setError('Une erreur est survenue lors de l\'envoi.');
                }

            } catch (error) {
                setError('Une erreur est survenue lors de la requête.');
            }
        };

        logIp();
    }, []);
}
