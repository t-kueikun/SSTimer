import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const LanguageSelector = () => {
    const { language, changeLanguage } = useLanguage();

    const languages = [
        { code: 'ja', label: '日本語' },
        { code: 'en', label: 'English' },
        { code: 'zh', label: '中文' },
        { code: 'ko', label: '한국어' },
        { code: 'ms', label: 'Bahasa Melayu' },
    ];

    return (
        <select
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                padding: '5px',
                fontSize: '0.8em',
                cursor: 'pointer',
                outline: 'none',
                backdropFilter: 'blur(5px)'
            }}
        >
            {languages.map((lang) => (
                <option key={lang.code} value={lang.code} style={{ color: 'black' }}>
                    {lang.label}
                </option>
            ))}
        </select>
    );
};

export default LanguageSelector;
