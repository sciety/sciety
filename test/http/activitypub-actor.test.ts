import { constructActorDocument } from '../../src/http/activitypub-actor';

describe('activitypub-actor', () => {
  describe('constructActorDocument', () => {
    const origin = 'https://example.com';
    const actorDocument = constructActorDocument(origin);

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
  });
});
