import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as controller from '../api/controller';
import { CurrencySwap } from './CurrencySwap';

jest.mock('../api/controller', () => ({
    fetchTokenPricesAPI: jest.fn(),
}));

const mockPrices = [
    { currency: 'ETH', price: 2000, date: '2026-03-01T00:00:00Z' },
    { currency: 'USDC', price: 1, date: '2026-03-01T00:00:00Z' },
    { currency: 'BTC', price: 40000, date: '2026-03-01T00:00:00Z' }
];

describe('CurrencySwap Component', () => {
    beforeEach(() => {
        // Reset the mock before each test
        (controller.fetchTokenPricesAPI as jest.Mock).mockResolvedValue(mockPrices);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders loading state initially', () => {
        render(<CurrencySwap />);
        expect(screen.getByText(/Initializing market prices/i)).toBeInTheDocument();
    });

    it('renders swap form after loading prices', async () => {
        render(<CurrencySwap />);

        await waitFor(() => {
            expect(screen.getByText(/You pay/i)).toBeInTheDocument();
        });

        expect(screen.getByText(/You receive/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Swap/i })).toBeInTheDocument();
    });

    it('validates amount input correctly', async () => {
        render(<CurrencySwap />);

        await waitFor(() => {
            expect(screen.getByText(/You pay/i)).toBeInTheDocument();
        });

        const amountInput = screen.getAllByPlaceholderText('0')[0];

        // Input negative value
        fireEvent.change(amountInput, { target: { value: '-10' } });

        // Wait for validation error to appear
        await waitFor(() => {
            expect(screen.getByText(/Amount must be greater than 0/i)).toBeInTheDocument();
        });

        // Check successful output calculation (2000 / 1)
        fireEvent.change(amountInput, { target: { value: '1' } });
        await waitFor(() => {
            expect(screen.queryByText(/Amount must be greater than 0/i)).not.toBeInTheDocument();
        });

        const receiveInput = screen.getAllByPlaceholderText('0')[1] as HTMLInputElement;
        expect(receiveInput).toHaveValue('2000.000000');
    });

    it('shows success popup on successful swap', async () => {
        jest.useFakeTimers();
        render(<CurrencySwap />);

        await waitFor(() => {
            expect(screen.getByText(/You pay/i)).toBeInTheDocument();
        });

        const amountInput = screen.getAllByPlaceholderText('0')[0];
        fireEvent.change(amountInput, { target: { value: '1' } });

        const swapButton = screen.getByRole('button', { name: /Swap/i });
        fireEvent.click(swapButton);

        // Button shows swapping
        expect(screen.getByText(/Swapping.../i)).toBeInTheDocument();

        // Advance timers by 2000ms
        jest.advanceTimersByTime(2000);

        await waitFor(() => {
            expect(screen.getByText(/Swap Successful!/i)).toBeInTheDocument();
        });

        expect(screen.getByText(/Successfully swapped 1 ETH for 2000.000000 USDC!/i)).toBeInTheDocument();
        jest.useRealTimers();
    });
});
