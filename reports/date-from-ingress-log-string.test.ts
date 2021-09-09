import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { dateFromIngressLogString } from './date-from-ingress-log-string';

describe('date-from-ingress-log-string', () => {
  it.todo('encodes to an ISO string');

  it('decodes to the correct Date object', () => {
    const input = '08/Aug/2021:22:31:46 +0000';
    const expectedDate = new Date('08/Aug/2021 22:31:46 +0000');
    const decoded = pipe(
      input,
      dateFromIngressLogString.decode,
    );

    expect(decoded).toStrictEqual(E.right(expectedDate));
  });
});
