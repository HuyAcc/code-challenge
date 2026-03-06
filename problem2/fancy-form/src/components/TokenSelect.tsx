import React, { useState, useRef, useEffect } from 'react';
import './TokenSelect.css';

interface TokenSelectProps {
    tokens: string[];
    value: string;
    onChange: (token: string) => void;
}

export const TokenSelect: React.FC<TokenSelectProps> = ({ tokens, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

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
    }, [wrapperRef]);

    const filteredTokens = tokens.filter(t => t.toLowerCase().includes(search.toLowerCase()));

    const handleSelect = (token: string) => {
        onChange(token);
        setIsOpen(false);
        setSearch('');
    };

    return (
        <div className="token-select-wrapper" ref={wrapperRef}>
            <button
                type="button"
                className="token-select-button"
                onClick={() => setIsOpen(!isOpen)}
            >
                {value ? (
                    <>
                        <img
                            src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${value}.svg`}
                            alt={value}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            className="token-icon"
                        />
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
                <div className="token-dropdown">
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
                            <li
                                key={token}
                                onClick={() => handleSelect(token)}
                                className={`token-item ${token === value ? 'selected' : ''}`}
                            >
                                <img
                                    src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${token}.svg`}
                                    alt={token}
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                    className="token-icon"
                                />
                                <span className="token-symbol">{token}</span>
                                {token === value && (
                                    <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </li>
                        ))}
                        {filteredTokens.length === 0 && <li className="no-results">No tokens found.</li>}
                    </ul>
                </div>
            )}
        </div>
    );
};
