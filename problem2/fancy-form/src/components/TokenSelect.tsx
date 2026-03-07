import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import './TokenSelect.css';

interface TokenSelectProps {
    tokens: string[];
    value: string;
    onChange: (token: string) => void;
}

const TOKEN_ICON_BASE = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens';

export const TokenSelect: React.FC<TokenSelectProps> = ({ tokens, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
    const wrapperRef = useRef<HTMLDivElement>(null);

    // useEffect: attach/detach click-outside listener
    // wrapperRef is a stable ref object — its identity never changes, so it's NOT needed in deps.
    // We only need to run this once on mount and clean up on unmount.
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []); // empty deps — intentional, wrapperRef.current is accessed at event time, not at setup time

    // useMemo: only recalculate filtered list when tokens or search changes
    const filteredTokens = useMemo(
        () => tokens.filter(t => t.toLowerCase().includes(search.toLowerCase())),
        [tokens, search]
    );

    // useCallback: stable handler reference
    const handleSelect = useCallback((token: string) => {
        onChange(token);
        setIsOpen(false);
        setSearch('');
    }, [onChange]);

    // useCallback: stable handler — track which token icons failed to load
    const handleImgError = useCallback((token: string) => {
        setImgErrors(prev => ({ ...prev, [token]: true }));
    }, []);

    const renderTokenIcon = (token: string, size: 'sm' | 'md' = 'sm') => {
        if (imgErrors[token]) {
            return (
                <span className={`token-icon-fallback token-icon-fallback--${size}`}>
                    {token.slice(0, 2)}
                </span>
            );
        }
        return (
            <img
                src={`${TOKEN_ICON_BASE}/${token}.svg`}
                alt={token}
                onError={() => handleImgError(token)}
                className={`token-icon token-icon--${size}`}
            />
        );
    };

    return (
        <div className="token-select-wrapper" ref={wrapperRef}>
            <button
                type="button"
                className="token-select-button"
                onClick={() => setIsOpen(prev => !prev)}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                {value ? (
                    <>
                        {renderTokenIcon(value, 'sm')}
                        <span className="token-symbol">{value}</span>
                    </>
                ) : (
                    <span className="token-symbol">Select Token</span>
                )}
                <svg className={`dropdown-icon ${isOpen ? 'open' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>

            {isOpen && (
                <div className="token-dropdown" role="listbox">
                    <div className="token-search-container">
                        <input
                            type="text"
                            placeholder="Search coin..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="token-search"
                            autoFocus
                        />
                    </div>
                    <ul className="token-list">
                        {filteredTokens.map(token => (
                            // key = token symbol (unique string), NOT index
                            <li
                                key={token}
                                role="option"
                                aria-selected={token === value}
                                onClick={() => handleSelect(token)}
                                className={`token-item ${token === value ? 'selected' : ''}`}
                            >
                                {renderTokenIcon(token, 'sm')}
                                <span className="token-symbol">{token}</span>
                                {token === value && (
                                    <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </li>
                        ))}
                        {filteredTokens.length === 0 && (
                            <li className="no-results" role="option" aria-selected={false}>
                                No tokens found.
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};
