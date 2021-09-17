import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { generateDocmapIndex } from '../../../src/docmaps/docmap-index';
import { groupEvaluatedArticle } from '../../../src/domain-events';
import * as GID from '../../../src/types/group-id';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

describe('generate-docmap-index', () => {
  const ncrcGroupId = GID.fromValidatedString('62f9b0d0-8d43-4766-a52a-ce02af61bc6a');

  it('includes an absolute url for each docmap in the index', async () => {
    const doi = arbitraryDoi();
    const result = await pipe(
      { updatedAfter: O.none, group: O.none },
      generateDocmapIndex({
        getAllEvents: T.of([
          groupEvaluatedArticle(ncrcGroupId, doi, arbitraryReviewId()),
        ]),
      }),
      T.map(({ articles }) => articles),
    )();

    expect(result).toStrictEqual(expect.arrayContaining([
      expect.objectContaining({
        docmap: expect.stringMatching(`https://.*${doi.value}\\.docmap\\.json`),
      }),
    ]));
  });

  describe('when no group identifier is supplied', () => {
    it('includes dois for each NCRC docmap', async () => {
      const doi = arbitraryDoi();
      const result = await pipe(
        { updatedAfter: O.none, group: O.none },
        generateDocmapIndex({
          getAllEvents: T.of([
            groupEvaluatedArticle(ncrcGroupId, doi, arbitraryReviewId()),
          ]),
        }),
        T.map(({ articles }) => articles),
      )();

      expect(result).toStrictEqual(expect.arrayContaining([
        expect.objectContaining({
          doi: doi.value,
        }),
      ]));
    });
  });

  describe('when passed a group identifier for NCRC', () => {
    it('only returns urls for NCRC docmaps', async () => {
      const doi = arbitraryDoi();
      const result = await pipe(
        { updatedAfter: O.none, group: O.some(ncrcGroupId) },
        generateDocmapIndex({
          getAllEvents: T.of([
            groupEvaluatedArticle(ncrcGroupId, doi, arbitraryReviewId()),
            groupEvaluatedArticle(arbitraryGroupId(), arbitraryDoi(), arbitraryReviewId()),
          ]),
        }),
        T.map(({ articles }) => articles),
      )();

      expect(result).toStrictEqual([
        expect.objectContaining({
          doi: doi.value,
        }),
      ]);
    });
  });

  describe('when passed anything else as the group argument', () => {
    it('returns an empty index', async () => {
      const result = await pipe(
        { updatedAfter: O.none, group: O.some(GID.fromValidatedString('foo')) },
        generateDocmapIndex({
          getAllEvents: T.of([
            groupEvaluatedArticle(ncrcGroupId, arbitraryDoi(), arbitraryReviewId()),
            groupEvaluatedArticle(arbitraryGroupId(), arbitraryDoi(), arbitraryReviewId()),
          ]),
        }),
        T.map(({ articles }) => articles),
      )();

      expect(result).toStrictEqual([]);
    });
  });
});
