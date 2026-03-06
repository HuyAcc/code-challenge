import { useState, useEffect } from 'react';
import { fetchTokenPricesAPI } from '../api/controller';

export interface TokenPrice {
    currency: string;
    date: string;
    price: number;
}

export const usePrices = () => {
    const [prices, setPrices] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const data = await fetchTokenPricesAPI();

                const priceMap: Record<string, number> = {};

                const sortedPrices = [...data].sort((a, b) => {
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                });

                for (const item of sortedPrices) {
                    if (!priceMap[item.currency] && item.price !== undefined) {
                        priceMap[item.currency] = item.price;
                    }
                }

                setPrices(priceMap);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch token prices.');
                setLoading(false);
            }
        };

        fetchPrices();
    }, []);

    return { prices, loading, error };
};
