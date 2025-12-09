import React, { useId } from 'react';

const Logo = ({ size = 40 }) => {
    const id = useId().replace(/:/g, ""); // Remove colons for CSS selector safety if needed
    const gradientId = `cupGradient-${id}`;
    const glowId = `glow-${id}`;

    return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00d2ff" />
                    <stop offset="100%" stopColor="#3a7bd5" />
                </linearGradient>
                <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Bottom Row */}
            <path d="M15 80 L25 50 H45 L55 80 H15 Z" fill={`url(#${gradientId})`} opacity="0.8" />
            <path d="M45 80 L55 50 H75 L85 80 H45 Z" fill={`url(#${gradientId})`} opacity="0.8" />

            {/* Top Row */}
            <path d="M30 50 L40 20 H60 L70 50 H30 Z" fill={`url(#${gradientId})`} filter={`url(#${glowId})`} />

            {/* Timer Line Hint */}
            <rect x="20" y="85" width="60" height="4" rx="2" fill="#fff" opacity="0.5" />
        </svg>
    );
};

export default Logo;
