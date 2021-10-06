import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { generateDocmaps } from '../../../src/docmaps/docmap';
import { Docmap, FindVersionsForArticleDoi } from '../../../src/docmaps/docmap/docmap';
import { groupEvaluatedArticle } from '../../../src/domain-events';
import { GroupId } from '../../../src/types/group-id';
import * as GID from '../../../src/types/group-id';
import { ReviewId } from '../../../src/types/review-id';
import { arbitraryDate, arbitraryUri } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryArticleServer } from '../../types/article-server.helper';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

describe('generate-docmaps', () => {
  const ncrcGroupId = GID.fromValidatedString('62f9b0d0-8d43-4766-a52a-ce02af61bc6a');
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
    getGroup: () => TO.some({
      ...arbitraryGroup(),
      id: indexedGroupId,
    }),
    fetchArticle: () => TE.right({ server: arbitraryArticleServer() }),
    getAllEvents: T.of([]),
  };

  describe('when the article hasn\'t been reviewed', () => {
    let docmaps: ReadonlyArray<Docmap>;

    beforeEach(async () => {
      docmaps = await pipe(
        generateDocmaps(defaultPorts)(arbitraryDoi().value),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns an empty array', () => {
      expect(docmaps).toStrictEqual([]);
    });
  });

  describe('when the article has been reviewed only by unsupported groups', () => {
    it.todo('returns an empty array');
  });

  describe('when the article has been reviewed by one supported group', () => {
    it.todo('returns an array containing one docmap');
  });

  describe('when the article has been reviewed by one supported group and one unsupported group', () => {
    it.todo('returns an array containing one docmap from the supported group');
  });

  describe('when the article has been reviewed by two supported groups', () => {
    it.todo('returns an array containing a docmap for each group');
  });

  describe('when both docmaps fail', () => {
    let response: E.Either<{ status: StatusCodes }, ReadonlyArray<Docmap>>;

    beforeEach(async () => {
      const articleId = arbitraryDoi();
      response = await pipe(
        generateDocmaps({
          ...defaultPorts,
          findVersionsForArticleDoi: () => TO.none,
          getAllEvents: T.of([
            groupEvaluatedArticle(ncrcGroupId, articleId, arbitraryReviewId()),
          ]),
        })(articleId.value),
      )();
    });

    it('returns a 500 http status code', async () => {
      expect(response).toStrictEqual(E.left({ status: StatusCodes.INTERNAL_SERVER_ERROR }));
    });

    it.todo('returns a message containing all the groups whose docmaps failed');
  });

  describe('when one docmap fails', () => {
    it.todo('returns a 500 http status code');

    it.todo('returns a message containing the group whose docmap failed');
  });

  describe('when the doi can\'t be decoded', () => {
    let response: E.Either<{ status: StatusCodes }, ReadonlyArray<Docmap>>;

    beforeEach(async () => {
      response = await pipe(
        generateDocmaps(defaultPorts)('not-a-doi'),
      )();
    });

    it('returns a 400 http status code', () => {
      expect(response).toStrictEqual(E.left({ status: StatusCodes.BAD_REQUEST }));
    });
  });
});
