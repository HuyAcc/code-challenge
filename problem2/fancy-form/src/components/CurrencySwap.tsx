import React, { useState, useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { usePrices } from '../hooks/usePrices';
import { TokenSelect } from './TokenSelect';
import { SuccessPopup } from './SuccessPopup';
import { ConfirmPopup } from './ConfirmPopup';
import './CurrencySwap.css';

interface SwapFormValues {
    fromToken: string;
    toToken: string;
    amountSend: number | string;
}

export const CurrencySwap: React.FC = () => {
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
        if (!amountSend || isNaN(Number(amountSend))) return '';
        return (Number(amountSend) * exchangeRate).toFixed(6);
    }, [amountSend, exchangeRate]);

    useEffect(() => {
        if (tokens.length > 0) {
            if (!tokens.includes(fromToken)) {
                setValue('fromToken', tokens[0]);
            }
            if (!tokens.includes(toToken)) {
                setValue('toToken', tokens.length > 1 ? tokens[1] : tokens[0]);
            }
        }
    }, [tokens, fromToken, toToken, setValue]);

    const onSubmit = (data: SwapFormValues) => {
        setFormError('');

        if (data.fromToken === data.toToken) {
            setFormError('Cannot swap the same token.');
            return;
        }

        setPendingSwapData(data);
        setConfirmMessage(`Are you sure you want to swap ${data.amountSend} ${data.fromToken} for ${amountReceive} ${data.toToken}?`);
        setIsConfirmOpen(true);
    };

    const handleConfirmSwap = () => {
        setIsConfirmOpen(false);
        if (!pendingSwapData) return;

        setIsSwapping(true);
        setTimeout(() => {
            setIsSwapping(false);
            setPopupMessage(`Successfully swapped ${pendingSwapData.amountSend} ${pendingSwapData.fromToken} for ${amountReceive} ${pendingSwapData.toToken}!`);
            setIsPopupOpen(true);
            setValue('amountSend', '');
            setPendingSwapData(null);
        }, 2000);
    };

    const handleSwitchTokens = () => {
        const currentFrom = watch('fromToken');
        const currentTo = watch('toToken');
        setValue('fromToken', currentTo);
        setValue('toToken', currentFrom);
        setValue('amountSend', '');
        setFormError('');
    };

    if (loading) {
        return (
            <div className="swap-card loading-state">
                <div className="spinner"></div>
                <p>Initializing market prices...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="swap-card error-state">
                <div className="error-icon">⚠️</div>
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="btn-retry">Retry</button>
            </div>
        );
    }

    return (
        <div className="swap-card">
            <div className="swap-header">
                <h2>Swap</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="swap-form">

                <div className="input-group">
                    <div className="input-group-header">
                        <label>Amount to send</label>
                    </div>
                    <div className="input-container">
                        <Controller
                            name="amountSend"
                            control={control}
                            rules={{
                                required: 'Amount is required',
                                validate: value => Number(value) > 0 || 'Amount must be greater than 0'
                            }}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type="number"
                                    className="amount-input"
                                    placeholder="0"
                                    min="0"
                                    step="any"
                                />
                            )}
                        />
                        <Controller
                            name="fromToken"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TokenSelect
                                    tokens={tokens}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                </div>

                <div className="switch-container">
                    <div className="switch-line"></div>
                    <button type="button" className={`switch-btn ${isSwapping ? 'spinning' : ''}`} onClick={handleSwitchTokens}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <polyline points="19 12 12 19 5 12"></polyline>
                        </svg>
                    </button>
                </div>

                <div className="input-group">
                    <div className="input-group-header">
                        <label>Amount to receive</label>
                    </div>
                    <div className="input-container readonly">
                        <input
                            type="text"
                            className="amount-input"
                            placeholder="0"
                            value={amountReceive}
                            readOnly
                        />
                        <Controller
                            name="toToken"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TokenSelect
                                    tokens={tokens}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                </div>

                {errors.amountSend && <div className="error-message">{errors.amountSend.message}</div>}
                {formError && !errors.amountSend && <div className="error-message">{formError}</div>}

                {exchangeRate > 0 && !formError && !errors.amountSend && (
                    <div className="exchange-rate-info">
                        1 {fromToken} = {exchangeRate.toFixed(6)} {toToken}
                    </div>
                )}

                <button
                    type="submit"
                    className={`submit-btn ${isSwapping ? 'swapping' : ''}`}
                    disabled={isSwapping || !isValid}
                >
                    {isSwapping ? (
                        <span className="swapping-content">
                            <span className="spinner-small"></span> Swapping...
                        </span>
                    ) : 'Swap'}
                </button>
            </form>

            <ConfirmPopup
                isOpen={isConfirmOpen}
                message={confirmMessage}
                onConfirm={handleConfirmSwap}
                onClose={() => {
                    setIsConfirmOpen(false);
                    setPendingSwapData(null);
                }}
            />

            <SuccessPopup
                isOpen={isPopupOpen}
                message={popupMessage}
                onClose={() => setIsPopupOpen(false)}
            />
        </div>
    );
};
