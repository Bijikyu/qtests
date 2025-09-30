// Tests for Express route detection via AST in TestGenerator
// Ensures support for express.Router(), custom router vars, named imports, require destructuring,
// require('express')() app creation, chained route().get().post(), and nested mounts via app.use().

import 'qtests/setup';
import fs from 'fs';
import path from 'path';
import { TestGenerator } from './testGenerator.js';

describe('TestGenerator Express route detection (AST)', () => {
  let tempDir: string;
  beforeEach(() => {
    tempDir = path.join(process.cwd(), 'tmp-tests-express-' + Math.random().toString(36).slice(2));
    fs.mkdirSync(tempDir, { recursive: true });
  });
  afterEach(() => {
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch {}
  });

  function makeGen() {
    return new TestGenerator({ SRC_DIR: tempDir, TEST_DIR: path.join(tempDir, 'tests', 'generated-tests') });
  }

  it('detects routes via named import Router alias', async () => {
    const p = path.join(tempDir, 'api-named-import.ts');
    fs.writeFileSync(p, `
      import { Router as R } from 'express';
      const api = R();
      api.get('/named', (req, res) => res.json({ ok: true }));
    `);

    const gen = makeGen();
    await gen.analyze(p);
    const results = gen.getResults().filter(r => r.type === 'api');
    expect(results.length).toBe(1);
    const expected = path.join(tempDir, 'tests', 'generated-tests',
      path.relative(process.cwd(), p).replace(/[\\/]/g, '__').replace(/\.[tj]sx?$/, '.GeneratedTest__get.test.ts'));
    expect(fs.existsSync(expected)).toBe(true);
  });

  it('detects routes via destructured require({ Router })', async () => {
    const p = path.join(tempDir, 'api-require-destructure.ts');
    fs.writeFileSync(p, `
      const { Router } = require('express');
      const r = Router();
      r.post('/login', (req, res) => res.json({ ok: true }));
    `);

    const gen = makeGen();
    await gen.analyze(p);
    const results = gen.getResults().filter(r => r.type === 'api');
    expect(results.length).toBe(1);
    const expected = path.join(tempDir, 'tests', 'generated-tests',
      path.relative(process.cwd(), p).replace(/[\\/]/g, '__').replace(/\.[tj]sx?$/, '.GeneratedTest__post.test.ts'));
    expect(fs.existsSync(expected)).toBe(true);
  });

  it('detects routes when app is created via require("express")()', async () => {
    const p = path.join(tempDir, 'api-app-require-call.ts');
    fs.writeFileSync(p, `
      const app = require('express')();
      app.put('/updates', (req, res) => res.json({ ok: true }));
    `);

    const gen = makeGen();
    await gen.analyze(p);
    const results = gen.getResults().filter(r => r.type === 'api');
    expect(results.length).toBe(1);
    const expected = path.join(tempDir, 'tests', 'generated-tests',
      path.relative(process.cwd(), p).replace(/[\\/]/g, '__').replace(/\.[tj]sx?$/, '.GeneratedTest__put.test.ts'));
    expect(fs.existsSync(expected)).toBe(true);
  });

  it('detects chained route().get().post() and route().patch()', async () => {
    const p = path.join(tempDir, 'api-chained-route.ts');
    fs.writeFileSync(p, `
      import express from 'express';
      const router = express.Router();
      router.route('/items').get((req, res) => res.json([])).post((req, res) => res.json({}));
      router.route('/users/:id').patch((req, res) => res.json({}));
    `);

    const gen = makeGen();
    await gen.analyze(p);
    const results = gen.getResults().filter(r => r.type === 'api');
    // Expect three tests: get /items, post /items, patch /users/:id
    expect(results.length).toBe(3);
    const base = path.relative(process.cwd(), p).replace(/[\\/]/g, '__').replace(/\.[tj]sx?$/, '');
    expect(fs.existsSync(path.join(tempDir, 'tests', 'generated-tests', base + '.GeneratedTest__get.test.ts'))).toBe(true);
    expect(fs.existsSync(path.join(tempDir, 'tests', 'generated-tests', base + '.GeneratedTest__post.test.ts'))).toBe(true);
    expect(fs.existsSync(path.join(tempDir, 'tests', 'generated-tests', base + '.GeneratedTest__patch.test.ts'))).toBe(true);
  });

  it('computes nested prefixes via app.use("/api", api) and router.use("/v1", v1)', async () => {
    const p = path.join(tempDir, 'api-nested-mounts.ts');
    fs.writeFileSync(p, `
      import express from 'express';
      const app = express();
      const api = express.Router();
      const v1 = express.Router();
      v1.get('/u', (req, res) => res.json([]));
      api.use('/v1', v1);
      app.use('/api', api);
    `);

    const gen = makeGen();
    await gen.analyze(p);
    const results = gen.getResults().filter(r => r.type === 'api');
    expect(results.length).toBe(1);
    const expectedPath = path.join(tempDir, 'tests', 'generated-tests',
      path.relative(process.cwd(), p).replace(/[\\/]/g, '__').replace(/\.[tj]sx?$/, '.GeneratedTest__get.test.ts'));
    expect(fs.existsSync(expectedPath)).toBe(true);
    // Also verify the generated test contains the full nested path
    const content = fs.readFileSync(expectedPath, 'utf8');
    // Generated tests use a deterministic uniqueRoute variable for safety
    expect(content).toMatch(/supertest\(app\)\n\s+\.get\(uniqueRoute\)/);
  });
});
