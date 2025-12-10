import React, { useState, useEffect } from 'react';
import './InstallPWA.css';
import { useLanguage } from '../../contexts/LanguageContext';

const InstallPWA = () => {
    const { t } = useLanguage();
    const [supportsPWA, setSupportsPWA] = useState(false);
    const [promptInstall, setPromptInstall] = useState(null);
    const [isIOS, setIsIOS] = useState(false);
    const [showGuide, setShowGuide] = useState(false);
    const [dismissed, setDismissed] = useState(() => {
        return localStorage.getItem('pwaDismissed') === 'true';
    });

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setPromptInstall(e);
            setSupportsPWA(true);
        };
        window.addEventListener('beforeinstallprompt', handler);

        // Detect iOS
        const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        // Check if already in standalone mode
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

        if (isIosDevice && !isStandalone) {
            setSupportsPWA(true);
            setIsIOS(true);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = (e) => {
        e.preventDefault();
        if (isIOS) {
            setShowGuide(true);
        } else if (promptInstall) {
            promptInstall.prompt();
            promptInstall.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    // Installed
                    setSupportsPWA(false);
                }
            });
        }
    };

    const handleDismiss = () => {
        setDismissed(true);
        localStorage.setItem('pwaDismissed', 'true');
    };

    if (!supportsPWA || dismissed) return null;

    return (
        <>
            <div className="pwa-toast">
                <div className="pwa-content">
                    <span className="pwa-icon">📱</span>
                    <div className="pwa-text">
                        <span className="pwa-title">{t('installApp')}</span>
                        <span className="pwa-desc">{t('installDesc')}</span>
                    </div>
                </div>
                <div className="pwa-actions">
                    <button className="pwa-btn-install" onClick={handleInstallClick}>
                        {t('install')}
                    </button>
                    <button className="pwa-btn-close" onClick={handleDismiss}>×</button>
                </div>
            </div>

            {/* iOS Guide Modal */}
            {showGuide && (
                <div className="pwa-guide-overlay" onClick={() => setShowGuide(false)}>
                    <div className="pwa-guide-card" onClick={e => e.stopPropagation()}>
                        <h3>{t('installIOS')}</h3>
                        <ol>
                            <li>{t('installIOSStep1')} <span className="share-icon">eb</span></li>
                            <li>{t('installIOSStep2')}</li>
                            <li>{t('installIOSStep3')}</li>
                        </ol>
                        <button onClick={() => setShowGuide(false)}>{t('close')}</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default InstallPWA;
