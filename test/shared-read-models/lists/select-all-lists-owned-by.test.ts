import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { groupEvaluatedArticle } from '../../../src/domain-events';
import { listCreated } from '../../../src/domain-events/list-created-event';
import { selectAllListsOwnedBy } from '../../../src/shared-read-models/lists';
import { arbitraryString, arbitraryWord } from '../../helpers';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

const arbitraryListId = () => `list-id-${arbitraryWord(6)}`;

describe('select-all-lists-owned-by', () => {
  const ownerId = arbitraryGroupId();

  describe('when the group does not own any list', () => {
    const result = pipe(
      [],
      selectAllListsOwnedBy(ownerId),
    );

    it.skip('returns an empty array of lists', () => {
      expect(result).toStrictEqual([]);
    });
  });

  describe('when the group owns an empty list', () => {
    const result = pipe(
      [
        listCreated(arbitraryListId(), arbitraryString(), arbitraryString(), ownerId),
      ],
      selectAllListsOwnedBy(ownerId),
      (lists) => lists[0],
    );

    it.todo('returns a title');

    it.todo('returns a description');

    it('returns a count of 0', () => {
      expect(result.articleCount).toBe(0);
    });

    it('returns no last updated date', () => {
      expect(result.lastUpdated).toStrictEqual(O.none);
    });
  });

  describe('when the group owns a list whose content is determined by evaluation events', () => {
    const newerDate = new Date('2021-07-08');

    const result = pipe(
      [
        listCreated(arbitraryListId(), 'Evaluated articles', arbitraryString(), ownerId),
        groupEvaluatedArticle(ownerId, arbitraryDoi(), arbitraryReviewId()),
        groupEvaluatedArticle(ownerId, arbitraryDoi(), arbitraryReviewId(), newerDate),
      ],
      selectAllListsOwnedBy(ownerId),
      (lists) => lists[0],
    );

    it.todo('returns a title');

    it.todo('returns a description');

    it('returns a count of the articles', () => {
      expect(result.articleCount).toBe(2);
    });

    it('returns the last updated date', () => {
      expect(result.lastUpdated).toStrictEqual(O.some(newerDate));
    });
  });

  describe('when the group owns a list whose content is determined by evaluation events and the group has evaluated one article more than once', () => {
    const olderDate = new Date('2021-07-08');
    const articleId = arbitraryDoi();

    const result = pipe(
      [
        listCreated(arbitraryListId(), 'Evaluated articles', arbitraryString(), ownerId),
        groupEvaluatedArticle(ownerId, articleId, arbitraryReviewId(), olderDate),
        groupEvaluatedArticle(ownerId, articleId, arbitraryReviewId()),
      ],
      selectAllListsOwnedBy(ownerId),
      (lists) => lists[0],
    );

    it('returns a count of 1', () => {
      expect(result.articleCount).toBe(1);
    });

    it.skip('returns the date of the article first being added to the list', () => {
      expect(result.lastUpdated).toStrictEqual(O.some(olderDate));
    });
  });

  describe('when a list with a different owner contains some articles', () => {
    const anotherOwnerId = arbitraryGroupId();
    const result = pipe(
      [
        listCreated(arbitraryListId(), 'Evaluated articles', arbitraryString(), anotherOwnerId),
        groupEvaluatedArticle(anotherOwnerId, arbitraryDoi(), arbitraryReviewId()),
      ],
      selectAllListsOwnedBy(ownerId),
    );

    it.skip('returns an empty array of lists', () => {
      expect(result).toStrictEqual([]);
    });
  });
});
