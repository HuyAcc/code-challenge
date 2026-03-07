import React from 'react';
import { Controller } from 'react-hook-form';
import { useCurrencySwap } from '../../hooks/useCurrencySwap';
import { TokenSelect } from '../TokenSelect/TokenSelect';
import { SuccessPopup } from '../SuccessPopup/SuccessPopup';
import { ConfirmPopup } from '../ConfirmPopup/ConfirmPopup';
import './CurrencySwap.css';

export const CurrencySwap: React.FC = () => {
    const {
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
    } = useCurrencySwap();

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

            <form onSubmit={handleSubmit(onSubmit)} className="swap-form" noValidate>

                <div className="input-group">
                    <div className="input-group-header">
                        <label htmlFor="amountSend">Amount to send</label>
                    </div>
                    <div className="input-container">
                        <Controller
                            name="amountSend"
                            control={control}
                            rules={{
                                required: 'Amount is required',
                                validate: (value) => {
                                    const num = Number(value);
                                    if (isNaN(num)) return 'Please enter a valid number';
                                    if (num <= 0) return 'Amount must be greater than 0';
                                    return true;
                                },
                            }}
                            render={({ field }) => (
                                <input
                                    id="amountSend"
                                    {...field}
                                    type="text"
                                    inputMode="decimal"
                                    className={`amount-input ${errors.amountSend ? 'input-error' : ''}`}
                                    placeholder="0.00"
                                    autoComplete="off"
                                    onKeyDown={(e) => {
                                        const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', '.'];
                                        if (allowed.includes(e.key)) return;
                                        if (e.key === '.' && String(field.value).includes('.')) {
                                            e.preventDefault();
                                            return;
                                        }
                                        if (!/^\d$/.test(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                            field.onChange(val);
                                        }
                                    }}
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
                    <button
                        type="button"
                        className={`switch-btn ${isSwapping ? 'spinning' : ''}`}
                        onClick={handleSwitchTokens}
                        aria-label="Switch tokens"
                        disabled={isSwapping}
                    >
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
                            placeholder="0.00"
                            value={amountReceive}
                            readOnly
                            aria-label="Amount to receive"
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

                {errors.amountSend && (
                    <div className="error-message" role="alert">{errors.amountSend.message}</div>
                )}
                {formError && !errors.amountSend && (
                    <div className="error-message" role="alert">{formError}</div>
                )}

                {exchangeRate > 0 && !formError && !errors.amountSend && (
                    <div className="exchange-rate-info">
                        <span>1 {fromToken} = {exchangeRate.toFixed(6)} {toToken}</span>
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
                onClose={handleCloseConfirm}
            />

            <SuccessPopup
                isOpen={isPopupOpen}
                message={popupMessage}
                onClose={handleClosePopup}
            />
        </div>
    );
};
