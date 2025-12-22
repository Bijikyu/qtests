/**
 * Type definitions for stubbing utilities
 */

import * as sinon from 'sinon';

export type StubRestoreFunction = () => void;
export type StubFunction = (...args: any[]) => any;

export type SinonSpy = sinon.SinonSpy;
export type SinonStub = sinon.SinonStub;
export type SinonMock = sinon.SinonMock;
export type SinonFakeTimers = sinon.SinonFakeTimers;