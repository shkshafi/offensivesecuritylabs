import React from 'react';
import { createRoot } from 'react-dom/client';
import NTTRaptorIndex from './nttraptor/index';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('report-creator-root');
    if (container) {
        const root = createRoot(container);
        root.render(<NTTRaptorIndex />);
    }
});
