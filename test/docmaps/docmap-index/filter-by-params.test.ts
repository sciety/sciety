import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { filterByParams } from '../../../src/docmaps/docmap-index/filter-by-params';
import { arbitraryDate, arbitraryUri } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryGroup } from '../../types/group.helper';

describe('filter-by-params', () => {
  describe('when no params are given', () => {
    const input = [
      {
        articleId: arbitraryDoi(),
        groupId: arbitraryGroupId(),
        updated: arbitraryDate(),
        publisherAccountId: arbitraryUri(),
      },
      {
        articleId: arbitraryDoi(),
        groupId: arbitraryGroupId(),
        updated: arbitraryDate(),
        publisherAccountId: arbitraryUri(),
      },
    ];

    const result = pipe(
      input,
      filterByParams({}),
      E.getOrElseW(shouldNotBeCalled),
    );

    it('returns unmodified input', () => {
      expect(result).toStrictEqual(input);
    });
  });

  describe('when invalid params are given', () => {
    const result = filterByParams({ updatedAfter: 'bar' })([]);

    it('returns a "bad request"', () => {
      expect(result).toStrictEqual(E.left(expect.objectContaining({
        status: StatusCodes.BAD_REQUEST,
      })));
    });
  });

  describe('when passed a publisher account ID', () => {
    const requestedGroup = arbitraryGroup();
    const allIndexEntries = [
      {
        articleId: arbitraryDoi(),
        groupId: requestedGroup.id,
        updated: arbitraryDate(),
        publisherAccountId: arbitraryUri(),
      },
      {
        articleId: arbitraryDoi(),
        groupId: arbitraryGroupId(),
        updated: arbitraryDate(),
        publisherAccountId: arbitraryUri(),
      },
    ];

    const result = pipe(
      allIndexEntries,
      filterByParams({ group: `https://sciety.org/groups/${requestedGroup.slug}` }),
      E.getOrElseW(shouldNotBeCalled),
    );

    it.skip('only returns entries by the corresponding group', () => {
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
          articleId: arbitraryDoi(),
          groupId: arbitraryGroupId(),
          updated: beforeSpecifiedDate,
          publisherAccountId: arbitraryUri(),
        },
        {
          articleId: arbitraryDoi(),
          groupId: arbitraryGroupId(),
          updated: afterSpecifiedDate,
          publisherAccountId: arbitraryUri(),
        },
      ];
      const result = pipe(
        input,
        filterByParams({ updatedAfter: specifiedDate.toISOString() }),
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
          articleId: arbitraryDoi(),
          groupId: arbitraryGroupId(),
          updated: beforeSpecifiedDate,
          publisherAccountId: arbitraryUri(),
        },
      ];
      const result = pipe(
        input,
        filterByParams({ updatedAfter: specifiedDate.toISOString() }),
        E.getOrElseW(shouldNotBeCalled),
      );

      it('returns an empty array', () => {
        expect(result).toStrictEqual([]);
      });
    });
  });
});
