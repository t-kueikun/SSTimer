import React from 'react';
import './MainLayout.css';

const MainLayout = ({ leftPanel, centerPanel, rightPanel, topBar, isFocused, showLeftPanel = true }) => {
    return (
        <div className={`main-layout ${isFocused ? 'focused' : ''}`}>
            <div className="header-bar">{topBar}</div>
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
        </div>
    );
};

export default MainLayout;
