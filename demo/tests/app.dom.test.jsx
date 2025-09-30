/**
 * @jest-environment jsdom
 */
// Ensure qtests setup runs first as per project policy.
require('qtests/setup');

import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import App from '../client/src/App.jsx';

describe('App (jsdom)', () => {
  it('renders demo text', () => {
    const mount = document.createElement('div');
    document.body.appendChild(mount);
    const root = createRoot(mount);
    act(() => {
      root.render(React.createElement(App));
    });
    expect(mount.textContent).toContain('QTests Demo Frontend');
    act(() => {
      root.unmount();
    });
  });
});
