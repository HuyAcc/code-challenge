import { useState, useMemo, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { usePrices } from './usePrices';

export interface SwapFormValues {
    fromToken: string;
    toToken: string;
    amountSend: number | string;
}

export const useCurrencySwap = () => {
    const { prices, loading, error } = usePrices();

    const tokens = useMemo(() => Object.keys(prices).sort(), [prices]);

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isValid },
    } = useForm<SwapFormValues>({
        defaultValues: {
            fromToken: 'ETH',
            toToken: 'USDC',
            amountSend: '',
        },
        mode: 'onChange',
    });

    const [isSwapping, setIsSwapping] = useState<boolean>(false);
    const [popupMessage, setPopupMessage] = useState<string>('');
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
    const [confirmMessage, setConfirmMessage] = useState<string>('');
    const [pendingSwapData, setPendingSwapData] = useState<SwapFormValues | null>(null);
    const [formError, setFormError] = useState<string>('');

    const fromToken = watch('fromToken');
    const toToken = watch('toToken');
    const amountSend = watch('amountSend');

    const exchangeRate = useMemo(() => {
        if (fromToken && toToken && prices[fromToken] && prices[toToken]) {
            return prices[fromToken] / prices[toToken];
        }
        return 0;
    }, [fromToken, toToken, prices]);

    const amountReceive = useMemo(() => {
        const num = Number(amountSend);
        if (!amountSend || isNaN(num) || num <= 0) return '';
        return (num * exchangeRate).toFixed(6);
    }, [amountSend, exchangeRate]);

    useEffect(() => {
        if (tokens.length === 0) return;
        const currentFrom = watch('fromToken');
        const currentTo = watch('toToken');
        if (!tokens.includes(currentFrom)) {
            setValue('fromToken', tokens[0]);
        }
        if (!tokens.includes(currentTo)) {
            setValue('toToken', tokens.length > 1 ? tokens[1] : tokens[0]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokens, setValue]);

    const onSubmit = useCallback((data: SwapFormValues) => {
        setFormError('');

        if (data.fromToken === data.toToken) {
            setFormError('Cannot swap the same token.');
            return;
        }

        setPendingSwapData(data);
        setConfirmMessage(
            `Are you sure you want to swap ${data.amountSend} ${data.fromToken} for ${amountReceive} ${data.toToken}?`
        );
        setIsConfirmOpen(true);
    }, [amountReceive]);

    const handleConfirmSwap = useCallback(() => {
        setIsConfirmOpen(false);
        if (!pendingSwapData) return;

        setIsSwapping(true);
        const snapshot = {
            amountSend: pendingSwapData.amountSend,
            fromToken: pendingSwapData.fromToken,
            toToken: pendingSwapData.toToken,
            amountReceive,
        };

        setTimeout(() => {
            setIsSwapping(false);
            setPopupMessage(
                `Successfully swapped ${snapshot.amountSend} ${snapshot.fromToken} for ${snapshot.amountReceive} ${snapshot.toToken}!`
            );
            setIsPopupOpen(true);
            setValue('amountSend', '');
            setPendingSwapData(null);
        }, 2000);
    }, [pendingSwapData, amountReceive, setValue]);

    const handleSwitchTokens = useCallback(() => {
        const currentFrom = watch('fromToken');
        const currentTo = watch('toToken');
        setValue('fromToken', currentTo);
        setValue('toToken', currentFrom);
        setValue('amountSend', '');
        setFormError('');
    }, [watch, setValue]);

    const handleCloseConfirm = useCallback(() => {
        setIsConfirmOpen(false);
        setPendingSwapData(null);
    }, []);

    const handleClosePopup = useCallback(() => {
        setIsPopupOpen(false);
    }, []);

    return {
        loading,
        error,
        tokens,
        control,
        handleSubmit,
        errors,
        isValid,
        onSubmit,
        fromToken,
        toToken,
        exchangeRate,
        amountReceive,
        isSwapping,
        formError,
        isConfirmOpen,
        confirmMessage,
        handleConfirmSwap,
        handleCloseConfirm,
        isPopupOpen,
        popupMessage,
        handleClosePopup,
        handleSwitchTokens,
    };
};
