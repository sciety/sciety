import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { filterByParams } from '../../../src/docmaps/docmap-index/filter-by-params';
import { publisherAccountId } from '../../../src/docmaps/docmap/publisher-account-id';
import { arbitraryDate, arbitraryUri } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryGroup } from '../../types/group.helper';

describe('filter-by-params', () => {
  describe('when no params are given', () => {
    const input = [
      {
        articleId: arbitraryArticleId(),
        groupId: arbitraryGroupId(),
        updated: arbitraryDate(),
        publisherAccountId: arbitraryUri(),
      },
      {
        articleId: arbitraryArticleId(),
        groupId: arbitraryGroupId(),
        updated: arbitraryDate(),
        publisherAccountId: arbitraryUri(),
      },
    ];

    const result = pipe(
      input,
      filterByParams({
        publisheraccount: O.none,
        updatedAfter: O.none,
      }),
      E.getOrElseW(shouldNotBeCalled),
    );

    it('returns unmodified input', () => {
      expect(result).toStrictEqual(input);
    });
  });

  describe('when passed a publisher account ID', () => {
    const requestedGroup = arbitraryGroup();
    const allIndexEntries = [
      {
        articleId: arbitraryArticleId(),
        groupId: requestedGroup.id,
        updated: arbitraryDate(),
        publisherAccountId: publisherAccountId(requestedGroup),
      },
      {
        articleId: arbitraryArticleId(),
        groupId: arbitraryGroupId(),
        updated: arbitraryDate(),
        publisherAccountId: arbitraryUri(),
      },
    ];

    const result = pipe(
      allIndexEntries,
      filterByParams({
        publisheraccount: O.some(publisherAccountId(requestedGroup)),
        updatedAfter: O.none,
      }),
      E.getOrElseW(shouldNotBeCalled),
    );

    it('only returns entries by the corresponding group', () => {
      expect(result).toStrictEqual([
        expect.objectContaining({
          groupId: requestedGroup.id,
        }),
      ]);
    });
  });

  describe('when passed an "updated after" parameter', () => {
    describe('when there are evaluations after the specified date', () => {
      const beforeSpecifiedDate = new Date('1990');
      const specifiedDate = new Date('1999');
      const afterSpecifiedDate = new Date('2020');
      const input = [
        {
          articleId: arbitraryArticleId(),
          groupId: arbitraryGroupId(),
          updated: beforeSpecifiedDate,
          publisherAccountId: arbitraryUri(),
        },
        {
          articleId: arbitraryArticleId(),
          groupId: arbitraryGroupId(),
          updated: afterSpecifiedDate,
          publisherAccountId: arbitraryUri(),
        },
      ];
      const result = pipe(
        input,
        filterByParams({ updatedAfter: O.some(specifiedDate), publisheraccount: O.none }),
        E.getOrElseW(shouldNotBeCalled),
      );

      it('only returns entries whose latest evaluation is after the specified date', () => {
        expect(result).toStrictEqual([
          expect.objectContaining({
            updated: afterSpecifiedDate,
          }),
        ]);
      });
    });

    describe('when there are no evaluations after the specified date', () => {
      const beforeSpecifiedDate = new Date('1990');
      const specifiedDate = new Date('1999');
      const input = [
        {
          articleId: arbitraryArticleId(),
          groupId: arbitraryGroupId(),
          updated: beforeSpecifiedDate,
          publisherAccountId: arbitraryUri(),
        },
      ];
      const result = pipe(
        input,
        filterByParams({ updatedAfter: O.some(specifiedDate), publisheraccount: O.none }),
        E.getOrElseW(shouldNotBeCalled),
      );

      it('returns an empty array', () => {
        expect(result).toStrictEqual([]);
      });
    });
  });
});
