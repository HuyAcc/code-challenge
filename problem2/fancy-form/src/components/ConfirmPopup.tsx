import React from 'react';
import './ConfirmPopup.css';

interface ConfirmPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
}

export const ConfirmPopup: React.FC<ConfirmPopupProps> = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content confirm-content" onClick={(e) => e.stopPropagation()}>
                <div className="popup-icon confirm-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                </div>
                <h3>Confirm Swap</h3>
                <p>{message}</p>
                <div className="popup-actions">
                    <button className="popup-cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="popup-confirm-btn" onClick={onConfirm}>Confirm</button>
                </div>
            </div>
        </div>
    );
};
