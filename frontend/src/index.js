import React from 'react';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container);

// Use environment variable to decide which app to bundle
const target = process.env.REACT_APP_TARGET || 'shop';

if (target === 'admin') {
  // Use require for better control over bundling during build time
  const AdminApp = require('./admin.jsx').default;
  root.render(
    <React.StrictMode>
      <AdminApp />
    </React.StrictMode>
  );
} else {
  const ShopApp = require('./index.jsx').default;
  root.render(
    <React.StrictMode>
      <ShopApp />
    </React.StrictMode>
  );
}
