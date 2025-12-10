import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './Settings.css';

const Settings = ({ onClose }) => {
    const { language, changeLanguage, t } = useLanguage();
    const [activeTab, setActiveTab] = useState('general');
    const [legalType, setLegalType] = useState(null); // 'terms' | 'privacy'

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'ja', name: '日本語' },
        { code: 'ko', name: '한국어' },
        { code: 'zh', name: '中文' },
        { code: 'ms', name: 'Bahasa Melayu' },
    ];

    const themes = [
        { name: 'Blue', color: '#00d2ff', glow: 'rgba(0, 210, 255, 0.3)' },
        { name: 'Red', color: '#ff4757', glow: 'rgba(255, 71, 87, 0.3)' },
        { name: 'Green', color: '#2ed573', glow: 'rgba(46, 213, 115, 0.3)' },
        { name: 'Orange', color: '#ffa502', glow: 'rgba(255, 165, 2, 0.3)' },
    ];

    const backgrounds = [
        { name: 'Default', value: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' },
        { name: 'Pure Black', value: '#000000' },
        { name: 'Purple', value: 'linear-gradient(135deg, #2d1b4e 0%, #1b102e 100%)' },
        { name: 'Forest', value: 'linear-gradient(135deg, #051f10 0%, #000000 100%)' },
        { name: 'Slate', value: '#1a1a1a' },
    ];

    const changeTheme = (theme) => {
        document.documentElement.style.setProperty('--accent-color', theme.color);
        document.documentElement.style.setProperty('--accent-glow', `0 0 15px ${theme.glow}`);
        // Can add more variables if needed
    };

    const changeBackground = (bg) => {
        document.documentElement.style.setProperty('--bg-gradient', bg.value);
    };

    const LegalContent = ({ type }) => {
        const content = type === 'terms' ? t('termsContent') : t('privacyContent');

        return (
            <div className="legal-content-view">
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#ccc', fontSize: '0.9rem', textAlign: 'left' }}>
                    {content}
                </div>
            </div>
        );
    };

    const renderContent = () => {
        if (legalType) {
            return <LegalContent type={legalType} />;
        }

        switch (activeTab) {
            case 'general':
                return (
                    <div className="setting-group">
                        <label>{t('language')}</label>
                        <select
                            value={language}
                            onChange={(e) => changeLanguage(e.target.value)}
                            className="setting-select"
                        >
                            {languages.map(lang => (
                                <option key={lang.code} value={lang.code}>
                                    {lang.name}
                                </option>
                            ))}
                        </select>
                    </div>
                );
            case 'appearance':
                return (
                    <>
                        <div className="setting-group">
                            <label>{t('accentColor')}</label>
                            <div className="theme-grid">
                                {themes.map(theme => (
                                    <button
                                        key={theme.name}
                                        className="theme-btn"
                                        style={{ background: theme.color, boxShadow: `0 0 10px ${theme.glow}` }}
                                        onClick={() => changeTheme(theme)}
                                        title={theme.name}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="setting-group">
                            <label>{language === 'ja' ? '背景' : 'Background'}</label>
                            <div className="theme-grid">
                                {backgrounds.map(bg => (
                                    <button
                                        key={bg.name}
                                        className="theme-btn"
                                        style={{ background: bg.value, border: '1px solid rgba(255,255,255,0.2)' }}
                                        onClick={() => changeBackground(bg)}
                                        title={bg.name}
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                );
            case 'about':
                return (
                    <div className="setting-group">
                        <label>{t('legal')}</label>
                        <div className="legal-links">
                            <button className="legal-link" onClick={() => setLegalType('terms')}>{t('terms')}</button>
                            <button className="legal-link" onClick={() => setLegalType('privacy')}>{t('privacy')}</button>
                        </div>
                        <div className="app-version">{t('version')} 1.0.0</div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="settings-overlay" onClick={onClose}>
            <div className="settings-modal" onClick={e => e.stopPropagation()}>
                <div className="settings-header">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {legalType && (
                            <button
                                onClick={() => setLegalType(null)}
                                style={{ background: 'transparent', border: 'none', color: '#fff', marginRight: '10px', cursor: 'pointer', fontSize: '1.2rem' }}
                            >
                                ←
                            </button>
                        )}
                        <h2>{legalType ? (legalType === 'terms' ? t('terms') : t('privacy')) : t('settings')}</h2>
                    </div>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                {!legalType && (
                    <div className="settings-tabs">
                        <button className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}>{t('general')}</button>
                        <button className={`tab-btn ${activeTab === 'appearance' ? 'active' : ''}`} onClick={() => setActiveTab('appearance')}>{t('appearance')}</button>
                        <button className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}>{t('about')}</button>
                    </div>
                )}

                <div className="settings-content">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Settings;
