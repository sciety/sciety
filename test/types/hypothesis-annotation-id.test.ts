import HypothesisAnnotationId from '../../src/types/hypothesis-annotation-id';

describe('hypothesis annotation id', () => {
  it('has a value', () => {
    const id = new HypothesisAnnotationId('foo');

    expect(id.value).toBe('foo');
  });

  it('casts to a string', () => {
    const id = new HypothesisAnnotationId('foo');

    expect(id.toString()).toBe('hypothesis:foo');
  });
});
