import * as NI from '../../src/types/ncrc-id';
import * as RRI from '../../src/types/rapid-review-id';
import { arbitraryNumber } from '../helpers';

describe('rapid-review-id', () => {
  const a: RRI.RapidReviewId = RRI.fromString('a');

  it('runtime discrimination', () => {
    const b: NI.NcrcId = NI.fromString('b');

    expect(RRI.has(a)).toBe(true);
    expect(RRI.has(b)).toBe(false);
  });

  it('equality', () => {
    expect(a === RRI.fromString('a')).toBe(true);
    expect(a === RRI.fromString('x')).toBe(false);
    // expect(a === NI.fromString('a')).toBe(false); // compile-time error as expected
  });

  it('use in Map keys', () => {
    const map = new Map<RRI.RapidReviewId, number>();
    const n = 42;
    map.set(a, n);

    expect(map.get(a)).toStrictEqual(n);
    expect(map.get(RRI.fromString('a'))).toBe(n);

    expect(map.has(a)).toBe(true);
    expect(map.has(RRI.fromString('a'))).toBe(true);

    expect(map.size).toBe(1);

    map.set(a, 21);

    expect(map.size).toBe(1);

    map.set(RRI.fromString('a'), arbitraryNumber(0, 100));

    expect(map.size).toBe(1);
  });

  it('use in Set', () => {
    const set = new Set<RRI.RapidReviewId>();
    set.add(a);

    expect(set.has(a)).toBe(true);
    expect(set.has(RRI.fromString('a'))).toBe(true);

    expect(set.size).toBe(1);

    set.add(a);

    expect(set.size).toBe(1);

    set.add(RRI.fromString('a'));

    expect(set.size).toBe(1);
  });

  it.todo('serialization / deserialization');
});
