import duoBuild from '../src/index.js';
import { describe, expect, it } from 'vitest';

describe('duoBuild', () => {
  it('is a function', () => {
    expect(duoBuild).toBeTypeOf('function');
  });
});
