import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import {
  DocmapModel,
  generateDocmapViewModel,
  Ports,
} from '../../../src/docmaps/docmap/generate-docmap-view-model';
import * as DE from '../../../src/types/data-error';
import { GroupId } from '../../../src/types/group-id';
import { ReviewId } from '../../../src/types/review-id';
import { arbitraryDate, arbitraryUri } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryArticleServer } from '../../types/article-server.helper';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryNcrcId, arbitraryReviewId } from '../../types/review-id.helper';

const indexedGroupId = arbitraryGroupId();
const articleId = arbitraryDoi();

const review = (groupId: GroupId, date: Date) => ({
  reviewId: arbitraryReviewId(),
  groupId,
  occurredAt: date,
});

const defaultPorts: Ports = {
  fetchReview: (id: ReviewId) => TE.right({ url: new URL(`https://reviews.example.com/${id}`) }),
  findReviewsForArticleDoi: () => TE.right([review(indexedGroupId, arbitraryDate())]),
  findVersionsForArticleDoi: () => TO.some([
    {
      source: new URL(arbitraryUri()),
      occurredAt: arbitraryDate(),
      version: 1,
    },
  ]),
  getGroup: () => TE.right({
    ...arbitraryGroup(),
    id: indexedGroupId,
  }),
  fetchArticle: () => TE.right({ server: arbitraryArticleServer() }),
};

describe('generate-docmap-view-model', () => {
  it('includes the article id', async () => {
    const ports = {
      ...defaultPorts,
      findReviewsForArticleDoi: () => TE.right([review(indexedGroupId, arbitraryDate())]),
    };
    const result = await pipe(
      { articleId, groupId: indexedGroupId },
      generateDocmapViewModel(ports),
      TE.getOrElse(shouldNotBeCalled),
    )();

    expect(result).toStrictEqual(expect.objectContaining({ articleId }));
  });

  it('includes the group', async () => {
    const group = arbitraryGroup();
    const ports = {
      ...defaultPorts,
      findReviewsForArticleDoi: () => TE.right([review(group.id, arbitraryDate())]),
      getGroup: () => TE.right(group),
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
    const laterDate = new Date('2000');
    const reviews = [
      review(indexedGroupId, earlierDate),
      review(indexedGroupId, laterDate),
    ];
    let result: DocmapModel;

    beforeEach(async () => {
      const ports = {
        ...defaultPorts,
        findReviewsForArticleDoi: () => TE.right(reviews),
      };
      result = await pipe(
        generateDocmapViewModel(ports)({ articleId, groupId: indexedGroupId }),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns all evaluations', () => {
      expect(result.evaluations).toStrictEqual([
        expect.objectContaining({
          occurredAt: earlierDate,
          reviewId: reviews[0].reviewId,
        }),
        expect.objectContaining({
          occurredAt: laterDate,
          reviewId: reviews[1].reviewId,
        }),
      ]);
    });
  });

  describe('when we can infer a source URL for the reviews', () => {
    it.todo('returns the inferred source URL rather than calling the port');
  });

  describe('when we cannot infer a source URL for the reviews', () => {
    const reviewIdWithUninferrableSourceUrl = arbitraryNcrcId();
    const reviews = [
      {
        reviewId: reviewIdWithUninferrableSourceUrl,
        groupId: indexedGroupId,
        occurredAt: arbitraryDate(),
      },
    ];
    const sourceUrl = new URL(arbitraryUri());
    let result: DocmapModel;

    beforeEach(async () => {
      const ports = {
        ...defaultPorts,
        fetchReview: () => TE.right({ url: sourceUrl }),
        findReviewsForArticleDoi: () => TE.right(reviews),
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
      const earlierDate = new Date('1900');
      const laterDate = new Date('2000');
      const reviewByThisGroup = review(indexedGroupId, laterDate);
      const ports = {
        ...defaultPorts,
        findReviewsForArticleDoi: () => TE.right(
          [
            review(arbitraryGroupId(), earlierDate),
            reviewByThisGroup,
          ],
        ),
      };

      const result = await pipe(
        generateDocmapViewModel(ports)({ articleId, groupId: indexedGroupId }),
        TE.getOrElse(shouldNotBeCalled),
      )();

      expect(result.evaluations).toStrictEqual([
        expect.objectContaining({
          reviewId: reviewByThisGroup.reviewId,
        }),
      ]);
    });
  });

  describe('when there is a single evaluation by the selected group', () => {
    let result: DocmapModel;
    const ports = {
      ...defaultPorts,
      findVersionsForArticleDoi: () => TO.none,
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
      getGroup: () => TE.left(DE.notFound),
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
