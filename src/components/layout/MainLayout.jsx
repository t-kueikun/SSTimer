import React, { useState } from 'react';
import './MainLayout.css';

const MainLayout = ({ leftPanel, centerPanel, rightPanel, topBar, isFocused, showLeftPanel = true }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className={`main-layout ${isFocused ? 'focused' : ''}`}>
            <div className="header-bar">
                {topBar}
                <button
                    className="mobile-menu-toggle"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    ☰
                </button>
            </div>
            <div className="content-grid">
                {showLeftPanel && (
                    <aside className="left-panel">
                        {leftPanel}
                    </aside>
                )}
                <main className="center-panel">
                    {centerPanel}
                </main>
                <aside className="right-panel">
                    {rightPanel}
                </aside>
            </div>

            {/* Mobile Drawer */}
            <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
                <div className="mobile-drawer-header">
                    <span>Stats & Tools</span>
                    <button onClick={() => setMobileMenuOpen(false)}>×</button>
                </div>
                <div className="mobile-drawer-content">
                    <div className="mobile-section">
                        {leftPanel}
                    </div>
                    <div className="mobile-section-divider"></div>
                    <div className="mobile-section tools-section">
                        {rightPanel}
                    </div>
                </div>
            </div>
            {mobileMenuOpen && <div className="mobile-backdrop" onClick={() => setMobileMenuOpen(false)}></div>}
        </div>
    );
};

export default MainLayout;
