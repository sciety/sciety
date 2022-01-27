import { pipe } from 'fp-ts/function';
import { articleAddedToList } from '../../src/domain-events/article-added-to-list-event';
import { needsToBeAdded } from '../../src/infrastructure/needs-to-be-added';
import { Doi } from '../../src/types/doi';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryListId } from '../types/list-id.helper';

describe('needs-to-be-added', () => {
  const articleId = arbitraryDoi();
  const listId = arbitraryListId();
  const eventToAdd = articleAddedToList(new Doi(articleId.value), listId);

  describe('when the event to be added is an existing event', () => {
    const existingEvents = [
      articleAddedToList(new Doi(articleId.value), listId),
    ];
    const result = pipe(
      eventToAdd,
      needsToBeAdded(existingEvents),
    );

    it('returns false', () => {
      expect(result).toBe(false);
    });
  });

  describe('when the event to be added pertains to the same article in a different list', () => {
    const existingEvents = [
      articleAddedToList(new Doi(articleId.value), arbitraryListId()),
    ];
    const result = pipe(
      eventToAdd,
      needsToBeAdded(existingEvents),
    );

    it('returns true', () => {
      expect(result).toBe(true);
    });
  });

  describe('when the event to be added is not an existing event', () => {
    const result = pipe(
      eventToAdd,
      needsToBeAdded([]),
    );

    it('returns true', () => {
      expect(result).toBe(true);
    });
  });
});
