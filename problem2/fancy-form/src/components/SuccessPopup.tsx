import React from 'react';
import './SuccessPopup.css';

interface SuccessPopupProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
}

export const SuccessPopup: React.FC<SuccessPopupProps> = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <div className="popup-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                </div>
                <h3>Swap Successful!</h3>
                <p>{message}</p>
                <button className="popup-close-btn" onClick={onClose}>Done</button>
            </div>
        </div>
    );
};
