import React from 'react';
import './EventSelector.css';

const EVENTS = [
    { id: '3-3-3', label: '3-3-3' },
    { id: '3-6-3', label: '3-6-3' },
    { id: 'cycle', label: 'Cycle' }
];

const EventSelector = ({ currentEvent, onEventChange }) => {
    return (
        <div className="event-selector">
            {EVENTS.map(event => (
                <button
                    key={event.id}
                    className={`event-btn ${currentEvent === event.id ? 'active' : ''}`}
                    onClick={() => onEventChange(event.id)}
                >
                    {event.label}
                </button>
            ))}
        </div>
    );
};

export default EventSelector;
