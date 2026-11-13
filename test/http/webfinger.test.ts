import * as E from 'fp-ts/Either';
import { constructWebfingerResponse } from '../../src/http/webfinger';

describe('webfinger', () => {
  describe('constructWebfingerResponse', () => {
    const origin = 'https://example.com';

    describe('given the acct URI of our actor', () => {
      const result = constructWebfingerResponse(origin, 'acct:sciety@example.com');

      it('returns the account as the subject, linking to the actor', () => {
        expect(result).toStrictEqual(E.right({
          subject: 'acct:sciety@example.com',
          links: [
            {
              rel: 'self',
              type: 'application/activity+json',
              href: 'https://example.com/activitypub/actor',
            },
          ],
        }));
      });
    });

    describe('given the acct URI of our actor in a different case', () => {
      it('returns the canonical account as the subject', () => {
        expect(constructWebfingerResponse(origin, 'acct:Sciety@EXAMPLE.com')).toStrictEqual(
          E.right(expect.objectContaining({ subject: 'acct:sciety@example.com' })),
        );
      });
    });

    describe.each([
      ['another user on our domain', 'acct:someone@example.com'],
      ['our user on another domain', 'acct:sciety@sciety.org'],
      ['the actor URL', 'https://example.com/activitypub/actor'],
    ])('given %s', (_, resource) => {
      it('fails as an unknown resource', () => {
        expect(constructWebfingerResponse(origin, resource)).toStrictEqual(E.left('unknown-resource'));
      });
    });

    describe.each([
      ['no resource', undefined],
      ['an empty resource', ''],
      ['repeated resources', ['acct:sciety@example.com', 'acct:sciety@example.com']],
    ])('given %s', (_, resource) => {
      it('fails as a missing resource', () => {
        expect(constructWebfingerResponse(origin, resource)).toStrictEqual(E.left('missing-resource'));
      });
    });
  });
});
