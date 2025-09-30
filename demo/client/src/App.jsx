// Minimal React component for the demo frontend.
// Not wired into a bundler here to keep demo lightweight; present to illustrate MERN structure.
import React from 'react';

export default function App() {
  // Keep component trivial; backend is validated via Jest tests.
  return React.createElement('div', null, 'QTests Demo Frontend');
}

