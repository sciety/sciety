import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { generateDocmaps } from '../../../src/docmaps/docmap';
import { Docmap } from '../../../src/docmaps/docmap/docmap-type';
import { FindVersionsForArticleDoi } from '../../../src/docmaps/docmap/generate-docmap-view-model';
import { groupEvaluatedArticle } from '../../../src/domain-events';
import * as DE from '../../../src/types/data-error';
import { GroupId } from '../../../src/types/group-id';
import * as GID from '../../../src/types/group-id';
import { ReviewId } from '../../../src/types/review-id';
import { arbitraryDate, arbitraryUri } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryArticleServer } from '../../types/article-server.helper';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

describe('generate-docmaps', () => {
  const articleId = arbitraryDoi();
  const ncrcGroupId = GID.fromValidatedString('62f9b0d0-8d43-4766-a52a-ce02af61bc6a');
  const rapidReviewsGroupId = GID.fromValidatedString('5142a5bc-6b18-42b1-9a8d-7342d7d17e94');
  const indexedGroupId = ncrcGroupId;
  const review = (groupId: GroupId, date: Date) => ({
    reviewId: arbitraryReviewId(),
    groupId,
    occurredAt: date,
  });
  const defaultPorts = {
    fetchReview: (id: ReviewId) => TE.right({ url: new URL(`https://reviews.example.com/${id}`) }),
    findReviewsForArticleDoi: () => TE.right([review(indexedGroupId, arbitraryDate())]),
    findVersionsForArticleDoi: (): ReturnType<FindVersionsForArticleDoi> => TO.some([
      {
        source: new URL(arbitraryUri()),
        occurredAt: arbitraryDate(),
        version: 1,
      },
    ]),
    getGroup: (groupId: GroupId) => TO.some({
      ...arbitraryGroup(),
      id: groupId,
    }),
    fetchArticle: () => TE.right({ server: arbitraryArticleServer() }),
    getAllEvents: T.of([]),
  };

  const generateDocmapsTestHelper = async (overridePorts: Record<string, unknown>) => pipe(
    generateDocmaps({ ...defaultPorts, ...overridePorts })(articleId.value),
    TE.getOrElse(shouldNotBeCalled),
  )();

  describe('when the article hasn\'t been reviewed', () => {
    let docmaps: ReadonlyArray<Docmap>;

    beforeEach(async () => {
      docmaps = await generateDocmapsTestHelper({
        getAllEvents: T.of([]),
      });
    });

    it('returns an empty array', () => {
      expect(docmaps).toStrictEqual([]);
    });
  });

  describe('when the article has been reviewed only by unsupported groups', () => {
    let docmaps: ReadonlyArray<Docmap>;

    beforeEach(async () => {
      docmaps = await generateDocmapsTestHelper({
        getAllEvents: T.of([
          groupEvaluatedArticle(arbitraryGroupId(), articleId, arbitraryReviewId()),
          groupEvaluatedArticle(arbitraryGroupId(), articleId, arbitraryReviewId()),
        ]),
      });
    });

    it('returns an empty array', () => {
      expect(docmaps).toStrictEqual([]);
    });
  });

  describe('when the article has been reviewed by one supported group', () => {
    let docmaps: ReadonlyArray<Docmap>;

    beforeEach(async () => {
      docmaps = await generateDocmapsTestHelper({
        getAllEvents: T.of([
          groupEvaluatedArticle(ncrcGroupId, articleId, arbitraryReviewId()),
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
      docmaps = await generateDocmapsTestHelper({
        getAllEvents: T.of([
          groupEvaluatedArticle(ncrcGroupId, articleId, arbitraryReviewId()),
          groupEvaluatedArticle(arbitraryGroupId(), articleId, arbitraryReviewId()),
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
          groupEvaluatedArticle(ncrcGroupId, articleId, arbitraryReviewId()),
          groupEvaluatedArticle(rapidReviewsGroupId, articleId, arbitraryReviewId()),
        ]),
      });
    });

    it('returns an array containing a docmap for each group', () => {
      expect(docmaps).toHaveLength(2);
      expect(docmaps[0].publisher.account.id).toContain(ncrcGroupId);
      expect(docmaps[1].publisher.account.id).toContain(rapidReviewsGroupId);
    });
  });

  describe('when the article has been reviewed multiple times by the same group', () => {
    let docmaps: ReadonlyArray<Docmap>;

    beforeEach(async () => {
      docmaps = await generateDocmapsTestHelper({
        findReviewsForArticleDoi: () => TE.right([
          review(ncrcGroupId, arbitraryDate()),
          review(ncrcGroupId, arbitraryDate()),
        ]),
        getAllEvents: T.of([
          groupEvaluatedArticle(ncrcGroupId, articleId, arbitraryReviewId()),
          groupEvaluatedArticle(ncrcGroupId, articleId, arbitraryReviewId()),
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
      const passingReviewId = arbitraryReviewId();
      response = await pipe(
        generateDocmaps({
          ...defaultPorts,
          fetchReview: (id: ReviewId) => (id === passingReviewId
            ? TE.right({ url: new URL(`https://reviews.example.com/${id}`) })
            : TE.left(DE.notFound)),
          getAllEvents: T.of([
            groupEvaluatedArticle(ncrcGroupId, articleId, passingReviewId),
            groupEvaluatedArticle(ncrcGroupId, articleId, arbitraryReviewId()),
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
