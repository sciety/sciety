import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { generateDocmapDois } from '../../../src/docmaps/docmap-index';
import { groupEvaluatedArticle } from '../../../src/domain-events';
import * as GID from '../../../src/types/group-id';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

describe('generate-docmap-dois', () => {
  const ncrcGroupId = GID.fromValidatedString('62f9b0d0-8d43-4766-a52a-ce02af61bc6a');

  it.todo('does not return duplicate dois for multiple evaluations of an article');

  describe('when no group identifier is supplied', () => {
    it('includes dois for each NCRC docmap', async () => {
      const doi = arbitraryDoi();
      const result = await pipe(
        { updatedAfter: O.none, group: O.none },
        generateDocmapDois({
          getAllEvents: T.of([
            groupEvaluatedArticle(ncrcGroupId, doi, arbitraryReviewId()),
          ]),
        }),
        T.map(E.getOrElseW(shouldNotBeCalled)),
      )();

      expect(result).toStrictEqual(expect.arrayContaining([doi]));
    });
  });

  describe('when passed a group identifier for NCRC', () => {
    it('only returns urls for NCRC docmaps', async () => {
      const doi = arbitraryDoi();
      const result = await pipe(
        { updatedAfter: O.none, group: O.some(ncrcGroupId) },
        generateDocmapDois({
          getAllEvents: T.of([
            groupEvaluatedArticle(ncrcGroupId, doi, arbitraryReviewId()),
            groupEvaluatedArticle(arbitraryGroupId(), arbitraryDoi(), arbitraryReviewId()),
          ]),
        }),
        T.map(E.getOrElseW(shouldNotBeCalled)),
      )();

      expect(result).toStrictEqual([doi]);
    });
  });

  describe('when passed anything else as the group argument', () => {
    it('returns an empty index', async () => {
      const result = await pipe(
        { updatedAfter: O.none, group: O.some(GID.fromValidatedString('foo')) },
        generateDocmapDois({
          getAllEvents: T.of([
            groupEvaluatedArticle(ncrcGroupId, arbitraryDoi(), arbitraryReviewId()),
            groupEvaluatedArticle(arbitraryGroupId(), arbitraryDoi(), arbitraryReviewId()),
          ]),
        }),
        T.map(E.getOrElseW(shouldNotBeCalled)),
      )();

      expect(result).toStrictEqual([]);
    });
  });

  describe('when passed an "updated after" parameter', () => {
    describe('when there are evaluations after the specified date', () => {
      it.skip('only includes docmaps whose latest evaluation is after the specified date', async () => {
        const includedDoi = arbitraryDoi();
        const result = await pipe(
          { updatedAfter: O.some(new Date('1970')), group: O.none },
          generateDocmapDois({
            getAllEvents: T.of([
              groupEvaluatedArticle(arbitraryGroupId(), arbitraryDoi(), arbitraryReviewId(), new Date('1900')),
              groupEvaluatedArticle(arbitraryGroupId(), includedDoi, arbitraryReviewId(), new Date('2000')),
            ]),
          }),
          T.map(E.getOrElseW(shouldNotBeCalled)),
        )();

        expect(result).toStrictEqual([includedDoi]);
      });
    });

    describe('when there are no evaluations after the specified date', () => {
      it.skip('returns an empty array', async () => {
        const result = await pipe(
          { updatedAfter: O.some(new Date('2020')), group: O.none },
          generateDocmapDois({
            getAllEvents: T.of([
              groupEvaluatedArticle(arbitraryGroupId(), arbitraryDoi(), arbitraryReviewId(), new Date('1900')),
              groupEvaluatedArticle(arbitraryGroupId(), arbitraryDoi(), arbitraryReviewId(), new Date('2000')),
            ]),
          }),
          T.map(E.getOrElseW(shouldNotBeCalled)),
        )();

        expect(result).toStrictEqual([]);
      });
    });
  });
});
