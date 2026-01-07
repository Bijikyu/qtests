/**
 * Clean Test Isolation Framework
 * 
 * Provides test isolation utilities without compilation errors
 */

export interface IsolationState {
  [key: string]: any;
  stack: (() => void)[];
}

export class TestIsolationManager {
  private state: IsolationState = {
    stack: []
  };
  
  reset(): void {
    this.state = { stack: [] };
    
    // Execute cleanup functions
    while (this.state.stack.length > 0) {
      const cleanup = this.state.stack.pop();
      try {
        if (cleanup) cleanup();
      } catch (error) {
        console.warn('Cleanup function failed:', error);
      }
    }
  }
  
  addCleanup(cleanup: () => void): void {
    this.state.stack.push(cleanup);
  }
  
  getState(): IsolationState {
    return { ...this.state };
  }
  
  setState(newState: Partial<IsolationState>): void {
    this.state = { ...this.state, ...newState };
  }
}

export const createTestIsolation = (): TestIsolationManager => {
  return new TestIsolationManager();
};

export const withIsolation = <T>(
  fn: (manager: TestIsolationManager) => Promise<T>
): Promise<T> => {
  const manager = createTestIsolation();
  
  try {
    return fn(manager);
  } finally {
    manager.reset();
  }
};