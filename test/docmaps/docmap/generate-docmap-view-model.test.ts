import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import {
  DocmapModel,
  generateDocmapViewModel,
  Ports,
} from '../../../src/docmaps/docmap/generate-docmap-view-model';
import { evaluationRecorded, groupCreated } from '../../../src/domain-events';
import * as DE from '../../../src/types/data-error';
import { inferredSourceUrl, ReviewId } from '../../../src/types/review-id';
import { arbitraryDate, arbitraryUri } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryArticleServer } from '../../types/article-server.helper';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryNcrcId, arbitraryReviewDoi, arbitraryReviewId } from '../../types/review-id.helper';

const indexedGroupId = arbitraryGroupId();
const articleId = arbitraryDoi();

const defaultPorts: Ports = {
  fetchReview: (id: ReviewId) => TE.right({ url: new URL(`https://reviews.example.com/${id}`) }),
  findVersionsForArticleDoi: () => TO.some([
    {
      source: new URL(arbitraryUri()),
      occurredAt: arbitraryDate(),
      version: 1,
    },
  ]),
  getAllEvents: T.of([]),
  fetchArticle: () => TE.right({ server: arbitraryArticleServer() }),
};

describe('generate-docmap-view-model', () => {
  it('includes the article id', async () => {
    const group = arbitraryGroup();
    const ports = {
      ...defaultPorts,
      getAllEvents: T.of([
        groupCreated({ ...group }),
        evaluationRecorded(group.id, articleId, arbitraryReviewId()),
      ]),
    };
    const result = await pipe(
      { articleId, groupId: group.id },
      generateDocmapViewModel(ports),
      TE.getOrElse(shouldNotBeCalled),
    )();

    expect(result).toStrictEqual(expect.objectContaining({ articleId }));
  });

  it('includes the group', async () => {
    const group = arbitraryGroup();
    const ports = {
      ...defaultPorts,
      getAllEvents: T.of([
        groupCreated({ ...group }),
        evaluationRecorded(group.id, articleId, arbitraryReviewId()),
      ]),
    };
    const result = await pipe(
      { articleId, groupId: group.id },
      generateDocmapViewModel(ports),
      TE.getOrElse(shouldNotBeCalled),
    )();

    expect(result).toStrictEqual(expect.objectContaining({ group }));
  });

  describe('when there are multiple evaluations by the selected group', () => {
    const earlierDate = new Date('1900');
    const earlierReviewId = arbitraryReviewId();
    const laterDate = new Date('2000');
    const laterReviewId = arbitraryReviewId();
    let result: DocmapModel;

    beforeEach(async () => {
      const ports = {
        ...defaultPorts,
        getAllEvents: T.of([
          groupCreated({ ...arbitraryGroup(), id: indexedGroupId }),
          evaluationRecorded(indexedGroupId, articleId, earlierReviewId, earlierDate),
          evaluationRecorded(indexedGroupId, articleId, laterReviewId, laterDate),
        ]),
      };
      result = await pipe(
        generateDocmapViewModel(ports)({ articleId, groupId: indexedGroupId }),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns all evaluations', () => {
      expect(result.evaluations).toStrictEqual([
        expect.objectContaining({
          recordedAt: earlierDate,
          reviewId: earlierReviewId,
        }),
        expect.objectContaining({
          recordedAt: laterDate,
          reviewId: laterReviewId,
        }),
      ]);
    });
  });

  describe('when we can infer a source URL for the reviews', () => {
    const reviewIdWithInferrableSourceUrl = arbitraryReviewDoi();
    const sourceUrl = pipe(
      inferredSourceUrl(reviewIdWithInferrableSourceUrl),
      O.getOrElseW(shouldNotBeCalled),
    );
    let result: DocmapModel;

    beforeEach(async () => {
      const ports = {
        ...defaultPorts,
        fetchReview: shouldNotBeCalled,
        getAllEvents: T.of([
          groupCreated({ ...arbitraryGroup(), id: indexedGroupId }),
          evaluationRecorded(indexedGroupId, articleId, reviewIdWithInferrableSourceUrl),
        ]),
      };
      result = await pipe(
        generateDocmapViewModel(ports)({ articleId, groupId: indexedGroupId }),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns the inferred source URL rather than calling the port', () => {
      expect(result.evaluations).toStrictEqual([
        expect.objectContaining({
          sourceUrl,
        }),
      ]);
    });
  });

  describe('when we cannot infer a source URL for the reviews', () => {
    const reviewIdWithUninferrableSourceUrl = arbitraryNcrcId();
    const sourceUrl = new URL(arbitraryUri());
    let result: DocmapModel;

    beforeEach(async () => {
      const ports = {
        ...defaultPorts,
        fetchReview: () => TE.right({ url: sourceUrl }),
        getAllEvents: T.of([
          groupCreated({ ...arbitraryGroup(), id: indexedGroupId }),
          evaluationRecorded(indexedGroupId, articleId, reviewIdWithUninferrableSourceUrl),
        ]),
      };
      result = await pipe(
        generateDocmapViewModel(ports)({ articleId, groupId: indexedGroupId }),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('obtains the source URL by calling the port', () => {
      expect(result.evaluations).toStrictEqual([
        expect.objectContaining({
          sourceUrl,
        }),
      ]);
    });
  });

  describe('when there are no evaluations by the selected group', () => {
    it('returns an E.left of not-found', async () => {
      const ports = {
        ...defaultPorts,
        findReviewsForArticleDoi: () => TE.right([]),
      };
      const result = await generateDocmapViewModel(ports)({ articleId, groupId: indexedGroupId })();

      expect(result).toStrictEqual(E.left('not-found'));
    });
  });

  describe('when there are evaluations by other groups', () => {
    it('only uses the evaluation by the selected group', async () => {
      const idOfEvaluationByThisGroup = arbitraryReviewId();
      const ports = {
        ...defaultPorts,
        getAllEvents: T.of([
          groupCreated({ ...arbitraryGroup(), id: indexedGroupId }),
          evaluationRecorded(arbitraryGroupId(), articleId, arbitraryReviewId()),
          evaluationRecorded(indexedGroupId, articleId, idOfEvaluationByThisGroup),
        ]),
      };

      const result = await pipe(
        generateDocmapViewModel(ports)({ articleId, groupId: indexedGroupId }),
        TE.getOrElse(shouldNotBeCalled),
      )();

      expect(result.evaluations).toStrictEqual([
        expect.objectContaining({
          reviewId: idOfEvaluationByThisGroup,
        }),
      ]);
    });
  });

  describe('when there is a single evaluation by the selected group', () => {
    let result: DocmapModel;
    const ports = {
      ...defaultPorts,
      getAllEvents: T.of([
        groupCreated({ ...arbitraryGroup(), id: indexedGroupId }),
        evaluationRecorded(indexedGroupId, articleId, arbitraryReviewId()),
      ]),
    };

    beforeEach(async () => {
      result = await pipe(
        { articleId, groupId: indexedGroupId },
        generateDocmapViewModel(ports),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns O.none for the input published date', async () => {
      expect(result.inputPublishedDate).toStrictEqual(O.none);
    });
  });

  describe('when the group cannot be retrieved', () => {
    let result: E.Either<DE.DataError, DocmapModel>;
    const ports = {
      ...defaultPorts,
      getAllEvents: T.of([]),
    };

    beforeEach(async () => {
      result = await pipe(
        { articleId, groupId: indexedGroupId },
        generateDocmapViewModel(ports),
      )();
    });

    it('returns not-found', async () => {
      expect(result).toStrictEqual(E.left('not-found'));
    });
  });
});
