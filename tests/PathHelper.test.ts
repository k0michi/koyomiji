import PathHelper from "../lib/PathHelper";
import { describe, expect, test } from '@jest/globals';

describe('PathHelper', () => {
  test('isPrefixedWithSlash', () => {
    expect(PathHelper.isPrefixedWithSlash('/')).toBe(true);
    expect(PathHelper.isPrefixedWithSlash('/a')).toBe(true);
  });

  test('prefixWithSlash', () => {
    expect(PathHelper.prefixWithSlash('/')).toBe('/');
    expect(PathHelper.prefixWithSlash('a')).toBe('/a');
    expect(PathHelper.prefixWithSlash('')).toBe('/');
  });

  test('removeTrailSlash', () => {
    expect(PathHelper.removeTrailSlash('/')).toBe('/');
    expect(PathHelper.removeTrailSlash('a/')).toBe('a');
    expect(PathHelper.removeTrailSlash('')).toBe('');
  });
});