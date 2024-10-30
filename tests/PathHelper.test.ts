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

  test('containsDots', () => {
    expect(PathHelper.containsDots('..')).toBe(true);
    expect(PathHelper.containsDots('.')).toBe(true);
    expect(PathHelper.containsDots('/..')).toBe(true);
    expect(PathHelper.containsDots('../../.')).toBe(true);
    expect(PathHelper.containsDots('/')).toBe(false);
    expect(PathHelper.containsDots('/a/b')).toBe(false);
  });

  test('isCanonical', () => {
    expect(PathHelper.isCanonical('/')).toBe(true);
    expect(PathHelper.isCanonical('/a')).toBe(true);
    expect(PathHelper.isCanonical('/a/b/')).toBe(true);
    expect(PathHelper.isCanonical('..')).toBe(false);
    expect(PathHelper.isCanonical('/..')).toBe(false);
  });

  test('pop', () => {
    expect(PathHelper.pop('/')).toBe('/');
    expect(PathHelper.pop('a/b')).toBe('a');
    expect(PathHelper.pop('/a/b')).toBe('/a');
    expect(PathHelper.pop('/a/b/..')).toBe('/');
  });

  test('push', () => {
    expect(PathHelper.push('/a', 'b')).toBe('/a/b');
    expect(PathHelper.push('a', 'b')).toBe('a/b');
  });

  test('at', () => {
    expect(PathHelper.at('/', 0)).toBe('/');
    expect(PathHelper.at('/a', 0)).toBe('/');
    expect(PathHelper.at('/a', 1)).toBe('a');
    expect(PathHelper.at('/a/', 2)).toBe('');
    expect(PathHelper.at('a', 0)).toBe('a');
  });
});