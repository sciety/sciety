import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { generateDocmaps } from '../../../src/docmaps/docmap';
import { Ports } from '../../../src/docmaps/docmap/generate-docmaps';
import { Docmap } from '../../../src/docmaps/docmap/docmap-type';
import { evaluationRecorded, groupJoined } from '../../../src/domain-events';
import * as DE from '../../../src/types/data-error';
import { GroupId } from '../../../src/types/group-id';
import * as GID from '../../../src/types/group-id';
import { ReviewId } from '../../../src/types/review-id';
import {
  arbitraryDate, arbitraryString, arbitraryUri, arbitraryWord,
} from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryArticleServer } from '../../types/article-server.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryNcrcId, arbitraryReviewId } from '../../types/review-id.helper';
import { arbitraryDescriptionPath } from '../../types/description-path.helper';

describe('generate-docmaps', () => {
  const articleId = arbitraryArticleId();
  const ncrcGroupId = GID.fromValidatedString('62f9b0d0-8d43-4766-a52a-ce02af61bc6a');
  const rapidReviewsGroupId = GID.fromValidatedString('5142a5bc-6b18-42b1-9a8d-7342d7d17e94');
  const review = (groupId: GroupId, recordedAt: Date, reviewId: ReviewId = arbitraryReviewId()) => ({
    reviewId,
    groupId,
    recordedAt,
    publishedAt: arbitraryDate(),
    authors: [],
  });
  const defaultPorts: Ports = {
    fetchReview: (id: ReviewId) => TE.right({ url: new URL(`https://reviews.example.com/${id}`) }),
    findVersionsForArticleDoi: () => TO.some([
      {
        source: new URL(arbitraryUri()),
        publishedAt: arbitraryDate(),
        version: 1,
      },
    ]),
    fetchArticle: () => TE.right({ server: arbitraryArticleServer() }),
    getAllEvents: T.of([]),
    getGroup: () => O.some(arbitraryGroup()),
  };

  const generateDocmapsTestHelper = async (overridePorts: Record<string, unknown>) => pipe(
    generateDocmaps({ ...defaultPorts, ...overridePorts })(articleId.value),
    TE.getOrElse(shouldNotBeCalled),
  )();

  describe('when the article hasn\'t been reviewed', () => {
    let response: E.Either<{ status: StatusCodes }, ReadonlyArray<Docmap>>;

    beforeEach(async () => {
      response = await pipe(
        arbitraryArticleId().value,
        generateDocmaps({
          ...defaultPorts,
          getAllEvents: T.of([]),
        }),
      )();
    });

    it('returns a 404 http status code', () => {
      expect(response).toStrictEqual(E.left(expect.objectContaining({ status: StatusCodes.NOT_FOUND })));
    });

    it('returns an error message', () => {
      expect(response).toStrictEqual(E.left(expect.objectContaining({ message: 'No Docmaps available for requested DOI' })));
    });
  });

  describe('when the article has been reviewed only by unsupported groups', () => {
    const group1 = arbitraryGroup();
    const group2 = arbitraryGroup();

    let response: E.Either<{ status: StatusCodes }, ReadonlyArray<Docmap>>;

    beforeEach(async () => {
      response = await pipe(
        articleId.value,
        generateDocmaps({
          ...defaultPorts,
          getAllEvents: T.of([
            groupJoined(
              group1.id,
              group1.name,
              group1.avatarPath,
              group1.descriptionPath,
              group1.shortDescription,
              group1.homepage,
              group1.slug,
            ),
            groupJoined(
              group2.id,
              group2.name,
              group2.avatarPath,
              group2.descriptionPath,
              group2.shortDescription,
              group2.homepage,
              group2.slug,
            ),
            evaluationRecorded(group1.id, articleId, arbitraryReviewId()),
            evaluationRecorded(group2.id, articleId, arbitraryReviewId()),
          ]),
        }),
      )();
    });

    it('returns a 404 http status code', () => {
      expect(response).toStrictEqual(E.left(expect.objectContaining({ status: StatusCodes.NOT_FOUND })));
    });

    it('returns an error message', () => {
      expect(response).toStrictEqual(E.left(expect.objectContaining({ message: 'No Docmaps available for requested DOI' })));
    });
  });

  describe('when the article has been reviewed by one supported group', () => {
    let docmaps: ReadonlyArray<Docmap>;

    beforeEach(async () => {
      const group = arbitraryGroup();
      docmaps = await generateDocmapsTestHelper({
        getAllEvents: T.of([
          groupJoined(
            ncrcGroupId,
            group.name,
            group.avatarPath,
            group.descriptionPath,
            group.shortDescription,
            group.homepage,
            group.slug,
          ),
          evaluationRecorded(ncrcGroupId, articleId, arbitraryReviewId()),
        ]),
      });
    });

    it('returns an array containing one docmap', () => {
      expect(docmaps).toHaveLength(1);
    });
  });

  describe('when the article has been reviewed by one supported group and one unsupported group', () => {
    let docmaps: ReadonlyArray<Docmap>;

    beforeEach(async () => {
      const group = arbitraryGroup();
      docmaps = await generateDocmapsTestHelper({
        getAllEvents: T.of([
          groupJoined(
            ncrcGroupId,
            group.name,
            group.avatarPath,
            group.descriptionPath,
            group.shortDescription,
            group.homepage,
            group.slug,
          ),
          evaluationRecorded(ncrcGroupId, articleId, arbitraryReviewId()),
          evaluationRecorded(arbitraryGroupId(), articleId, arbitraryReviewId()),
        ]),
      });
    });

    it('returns an array containing one docmap from the supported group', () => {
      expect(docmaps).toHaveLength(1);
    });
  });

  describe('when the article has been reviewed by two supported groups', () => {
    let docmaps: ReadonlyArray<Docmap>;

    beforeEach(async () => {
      docmaps = await generateDocmapsTestHelper({
        findReviewsForArticleDoi: () => TE.right([
          review(ncrcGroupId, arbitraryDate()),
          review(rapidReviewsGroupId, arbitraryDate()),
        ]),
        getAllEvents: T.of([
          groupJoined(
            ncrcGroupId,
            arbitraryString(),
            arbitraryWord(),
            arbitraryDescriptionPath(),
            arbitraryString(),
            arbitraryUri(),
            arbitraryWord(),
          ),
          groupJoined(
            rapidReviewsGroupId,
            arbitraryString(),
            arbitraryWord(),
            arbitraryDescriptionPath(),
            arbitraryString(),
            arbitraryUri(),
            arbitraryWord(),
          ),
          evaluationRecorded(ncrcGroupId, articleId, arbitraryReviewId()),
          evaluationRecorded(rapidReviewsGroupId, articleId, arbitraryReviewId()),
        ]),
      });
    });

    it('returns an array containing a docmap for each group', () => {
      expect(docmaps).toHaveLength(2);
      expect(docmaps[0].publisher.account.id).not.toBe(
        docmaps[1].publisher.account.id,
      );
    });
  });

  describe('when the article has been reviewed multiple times by the same group', () => {
    let docmaps: ReadonlyArray<Docmap>;

    beforeEach(async () => {
      const group = arbitraryGroup();
      docmaps = await generateDocmapsTestHelper({
        findReviewsForArticleDoi: () => TE.right([
          review(ncrcGroupId, arbitraryDate()),
          review(ncrcGroupId, arbitraryDate()),
        ]),
        getAllEvents: T.of([
          groupJoined(
            ncrcGroupId,
            group.name,
            group.avatarPath,
            group.descriptionPath,
            group.shortDescription,
            group.homepage,
            group.slug,
          ),
          evaluationRecorded(ncrcGroupId, articleId, arbitraryReviewId()),
          evaluationRecorded(ncrcGroupId, articleId, arbitraryReviewId()),
        ]),
      });
    });

    it('returns an array containing a single docmap for that group', () => {
      expect(docmaps).toHaveLength(1);
    });
  });

  describe('when any docmap fails', () => {
    let response: E.Either<{ status: StatusCodes, message: string }, ReadonlyArray<Docmap>>;

    beforeEach(async () => {
      const group = arbitraryGroup();
      const failingReviewId = arbitraryNcrcId();
      response = await pipe(
        generateDocmaps({
          ...defaultPorts,
          fetchReview: (id: ReviewId) => (
            id === failingReviewId
              ? TE.left(DE.notFound)
              : TE.right({ url: new URL(`https://reviews.example.com/${id}`) })
          ),
          getAllEvents: T.of([
            groupJoined(
              ncrcGroupId,
              group.name,
              group.avatarPath,
              group.descriptionPath,
              group.shortDescription,
              group.homepage,
              group.slug,
            ),
            evaluationRecorded(ncrcGroupId, articleId, arbitraryReviewId()),
            evaluationRecorded(ncrcGroupId, articleId, failingReviewId),
          ]),
        })(articleId.value),
      )();
    });

    it('returns a 500 http status code', () => {
      expect(response).toStrictEqual(E.left(expect.objectContaining({ status: StatusCodes.INTERNAL_SERVER_ERROR })));
    });

    it('returns an error message', () => {
      expect(response).toStrictEqual(E.left(expect.objectContaining({ message: 'Failed to generate docmaps' })));
    });
  });

  describe('when the doi can\'t be decoded', () => {
    let response: E.Either<{ status: StatusCodes }, ReadonlyArray<Docmap>>;

    beforeEach(async () => {
      response = await pipe(
        generateDocmaps(defaultPorts)('not-a-doi'),
      )();
    });

    it('returns a 400 http status code', () => {
      expect(response).toStrictEqual(E.left(expect.objectContaining({ status: StatusCodes.BAD_REQUEST })));
    });

    it('returns an error message', () => {
      expect(response).toStrictEqual(E.left(expect.objectContaining({ message: 'Invalid DOI requested' })));
    });
  });
});
