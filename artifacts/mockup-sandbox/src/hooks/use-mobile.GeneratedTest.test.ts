// Generated unit test for use-mobile.tsx - TypeScript ES module
// 🚩AI: ENTRY_POINT_FOR_GENERATED_TEST_IMPORTS
import 'qtests/setup';

let testModule: any;
beforeAll(async () => {
  testModule = await import('./use-mobile');
});
import * as React from 'react';
import { render } from '@testing-library/react';

describe('useIsMobile Hook', () => {
  it('mounts via probe without errors', () => {
    // Create hook probe component (never call hooks outside a component)
    function HookProbe() {
      const hookResult = (testModule as any)['useIsMobile']();
      return React.createElement('div', { 'data-testid': 'hook-result' }, String(!!hookResult));
    }
    const { getByTestId } = render(React.createElement(HookProbe));
    expect(getByTestId('hook-result')).toBeInTheDocument();
  });
});
