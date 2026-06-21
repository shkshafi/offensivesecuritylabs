import React from 'react';
import { createRoot } from 'react-dom/client';
import ReportCreatorIndex from './nttraptor/index';

const mountApp = () => {
    const container = document.getElementById('report-creator-root');
    if (container) {
        const root = createRoot(container);
        root.render(<ReportCreatorIndex />);
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountApp);
} else {
    mountApp();
}
