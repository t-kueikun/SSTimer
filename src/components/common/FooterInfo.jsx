import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './FooterInfo.css';

const FooterInfo = () => {
    const { t } = useLanguage();

    return (
        <footer className="footer-info">
            <div className="footer-container">
                <section className="footer-section">
                    <h3>{t('seo_about_title')}</h3>
                    <p>{t('seo_about_text')}</p>
                </section>

                <div className="footer-grid">
                    <section className="footer-section">
                        <h4>{t('seo_features_title')}</h4>
                        <ul>
                            <li>{t('seo_features_1')}</li>
                            <li>{t('seo_features_2')}</li>
                            <li>{t('seo_features_3')}</li>
                            <li>{t('seo_features_4')}</li>
                        </ul>
                    </section>

                    <section className="footer-section">
                        <h4>{t('seo_how_to_title')}</h4>
                        <ol>
                            <li>{t('seo_how_to_1')}</li>
                            <li>{t('seo_how_to_2')}</li>
                            <li>{t('seo_how_to_3')}</li>
                        </ol>
                    </section>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} SS Timer. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default FooterInfo;
