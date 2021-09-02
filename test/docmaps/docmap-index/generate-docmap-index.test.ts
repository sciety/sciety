import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { generateDocmapIndex } from '../../../src/docmaps/docmap-index/generate-docmap-index';
import { editorialCommunityReviewedArticle } from '../../../src/domain-events';
import * as GID from '../../../src/types/group-id';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

describe('generate-docmap-index', () => {
  const ncrcGroupId = GID.fromValidatedString('62f9b0d0-8d43-4766-a52a-ce02af61bc6a');
  const reviewCommonsGroupId = GID.fromValidatedString('316db7d9-88cc-4c26-b386-f067e0f56334');
  const hardcodedReviewCommonsDocmapDoi = '10.1101/2021.04.25.441302';

  it('includes an absolute url for each docmap in the index', async () => {
    const doi = arbitraryDoi();
    const result = await pipe(
      { updatedAfter: O.none, group: O.none },
      generateDocmapIndex({
        getAllEvents: T.of([
          editorialCommunityReviewedArticle(ncrcGroupId, doi, arbitraryReviewId()),
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
    it('includes the doi of the hardcoded Review Commons docmap', async () => {
      const result = await pipe(
        { updatedAfter: O.none, group: O.none },
        generateDocmapIndex({
          getAllEvents: T.of([]),
        }),
        T.map(({ articles }) => articles),
      )();

      expect(result).toStrictEqual(expect.arrayContaining([
        expect.objectContaining({
          doi: hardcodedReviewCommonsDocmapDoi,
        }),
      ]));
    });

    it('includes dois for each NCRC docmap', async () => {
      const doi = arbitraryDoi();
      const result = await pipe(
        { updatedAfter: O.none, group: O.none },
        generateDocmapIndex({
          getAllEvents: T.of([
            editorialCommunityReviewedArticle(ncrcGroupId, doi, arbitraryReviewId()),
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
            editorialCommunityReviewedArticle(ncrcGroupId, doi, arbitraryReviewId()),
            editorialCommunityReviewedArticle(arbitraryGroupId(), arbitraryDoi(), arbitraryReviewId()),
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

  describe('when passed a group identifier for Review Commons', () => {
    it('only returns the doi for the hardcoded Review Commons docmap', async () => {
      const result = await pipe(
        { updatedAfter: O.none, group: O.some(reviewCommonsGroupId) },
        generateDocmapIndex({
          getAllEvents: T.of([
            editorialCommunityReviewedArticle(ncrcGroupId, arbitraryDoi(), arbitraryReviewId()),
            editorialCommunityReviewedArticle(arbitraryGroupId(), arbitraryDoi(), arbitraryReviewId()),
          ]),
        }),
        T.map(({ articles }) => articles),
      )();

      expect(result).toStrictEqual([
        expect.objectContaining({
          doi: hardcodedReviewCommonsDocmapDoi,
        }),
      ]);
    });
  });

  describe('when passed anything else as the group argument', () => {
    it.todo('returns an empty index');
  });
});
