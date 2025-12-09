import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const SettingsModal = ({ onClose }) => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('general');

    const renderContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div>
                        <h3>General Settings</h3>
                        <p>More settings coming soon.</p>
                    </div>
                );
            case 'terms':
                return (
                    <div style={{ maxHeight: '300px', overflowY: 'auto', fontSize: '0.9em' }}>
                        <h3>Terms of Service</h3>
                        <p>1. Acceptance of Terms<br />By accessing strict speed stacking timer, you agree to these terms.</p>
                        <p>2. Usage<br />This timer is for personal practice use.</p>
                        <p>3. Disclaimer<br />We are not responsible for any data loss.</p>
                        {/* Placeholder text */}
                    </div>
                );
            case 'privacy':
                return (
                    <div style={{ maxHeight: '300px', overflowY: 'auto', fontSize: '0.9em' }}>
                        <h3>Privacy Policy</h3>
                        <p>1. Data Collection<br />We use Google Authentication provided by Firebase. We store your timer data in Firestore.</p>
                        <p>2. Data Usage<br />Data is used solely for functionality of the app (syncing your times).</p>
                        <p>3. Third Parties<br />Google Firebase services are used for infrastructure.</p>
                        {/* Placeholder text */}
                    </div>
                );
            default:
                return null;
        }
    };

    const TabButton = ({ id, label }) => (
        <button
            onClick={() => setActiveTab(id)}
            style={{
                flex: 1,
                padding: '10px',
                background: activeTab === id ? 'rgba(255,255,255,0.2)' : 'transparent',
                border: 'none',
                color: 'white',
                borderBottom: activeTab === id ? '2px solid #00d2ff' : '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer'
            }}
        >
            {label}
        </button>
    );

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div style={{
                background: '#1e293b', width: '90%', maxWidth: '500px', borderRadius: '12px',
                padding: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0 }}>Settings</h2>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#aaa', fontSize: '1.5em', cursor: 'pointer' }}>×</button>
                </div>

                <div style={{ display: 'flex', marginBottom: '20px' }}>
                    <TabButton id="general" label="General" />
                    <TabButton id="terms" label="Terms" />
                    <TabButton id="privacy" label="Privacy" />
                </div>

                <div style={{ minHeight: '200px' }}>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
