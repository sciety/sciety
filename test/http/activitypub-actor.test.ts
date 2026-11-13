import { Buffer } from 'buffer';
import { generateKeyPairSync } from 'crypto';
import * as O from 'fp-ts/Option';
import {
  constructActorDocument,
  derivePublicKeyPem,
  derivePublicKeyPemFromBase64EncodedPrivateKey,
} from '../../src/http/activitypub-actor';

describe('activitypub-actor', () => {
  describe('constructActorDocument', () => {
    const origin = 'https://example.com';

    describe('without a public key', () => {
      const actorDocument = constructActorDocument(origin, O.none);

      it('is an Application actor', () => {
        expect(actorDocument.type).toBe('Application');
      });

      it('has an id that is the URL it is served at', () => {
        expect(actorDocument.id).toBe('https://example.com/activitypub/actor');
      });

      it('has an inbox and an outbox under the actor', () => {
        expect(actorDocument.inbox).toBe('https://example.com/activitypub/actor/inbox');
        expect(actorDocument.outbox).toBe('https://example.com/activitypub/actor/outbox');
      });

      it('links to a human-readable page on the same origin', () => {
        expect(actorDocument.url).toBe('https://example.com/about');
      });

      it('has no publicKey', () => {
        expect(actorDocument).not.toHaveProperty('publicKey');
      });
    });

    describe('with a public key', () => {
      const actorDocument = constructActorDocument(origin, O.some('a-public-key-pem'));

      it('exposes the public key, owned by the actor', () => {
        expect(actorDocument.publicKey).toStrictEqual({
          id: 'https://example.com/activitypub/actor#main-key',
          owner: 'https://example.com/activitypub/actor',
          publicKeyPem: 'a-public-key-pem',
        });
      });
    });
  });

  describe('derivePublicKeyPem', () => {
    describe('given a valid private key', () => {
      const { privateKey, publicKey } = generateKeyPairSync('rsa', {
        modulusLength: 2048,
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
        publicKeyEncoding: { type: 'spki', format: 'pem' },
      });

      it('returns the matching public key', () => {
        expect(derivePublicKeyPem(privateKey)).toStrictEqual(O.some(publicKey));
      });
    });

    describe('given an invalid private key', () => {
      it('returns none', () => {
        expect(derivePublicKeyPem('not-a-key')).toStrictEqual(O.none);
      });
    });
  });

  describe('derivePublicKeyPemFromBase64EncodedPrivateKey', () => {
    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      publicKeyEncoding: { type: 'spki', format: 'pem' },
    });
    const encodeBase64 = (value: string) => Buffer.from(value).toString('base64');

    describe('given a base64 encoded private key', () => {
      it('returns the matching public key', () => {
        expect(derivePublicKeyPemFromBase64EncodedPrivateKey(encodeBase64(privateKey)))
          .toStrictEqual(O.some(publicKey));
      });
    });

    describe('given a private key that is not base64 encoded', () => {
      it('returns none', () => {
        expect(derivePublicKeyPemFromBase64EncodedPrivateKey(privateKey)).toStrictEqual(O.none);
      });
    });
  });
});
