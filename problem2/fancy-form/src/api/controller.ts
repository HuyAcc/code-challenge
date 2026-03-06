import axios from 'axios';
import type { TokenPrice } from '../hooks/usePrices';

const API_URL = 'https://interview.switcheo.com/prices.json';

export const fetchTokenPricesAPI = async (): Promise<TokenPrice[]> => {
    const response = await axios.get<TokenPrice[]>(API_URL);
    return response.data;
};
