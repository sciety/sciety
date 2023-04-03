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
import { evaluationRecorded, groupJoined } from '../../../src/domain-events';
import * as DE from '../../../src/types/data-error';
import { inferredSourceUrl, ReviewId } from '../../../src/types/review-id';
import { arbitraryDate, arbitraryUri } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryArticleServer } from '../../types/article-server.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryNcrcId, arbitraryReviewDoi, arbitraryReviewId } from '../../types/review-id.helper';
import { TestFramework, createTestFramework } from '../../framework';
import { RecordedEvaluation } from '../../../src/types/recorded-evaluation';
import { arbitraryRecordedEvaluation } from '../../types/recorded-evaluation.helper';

const indexedGroupId = arbitraryGroupId();
const articleId = arbitraryArticleId();

const defaultPorts: Ports = {
  fetchReview: (id: ReviewId) => TE.right({ url: new URL(`https://reviews.example.com/${id}`) }),
  findVersionsForArticleDoi: () => TO.some([
    {
      source: new URL(arbitraryUri()),
      publishedAt: arbitraryDate(),
      version: 1,
    },
  ]),
  getAllEvents: T.of([]),
  fetchArticle: () => TE.right({ server: arbitraryArticleServer() }),
  getGroup: () => O.some(arbitraryGroup()),
};

describe('generate-docmap-view-model', () => {
  let framework: TestFramework;
  let defaultAdapters: Ports;

  beforeEach(async () => {
    framework = createTestFramework();
    defaultAdapters = {
      ...framework.queries,
      ...framework.happyPathThirdParties,
      getAllEvents: framework.getAllEvents,
    };
  });

  it('includes the article id', async () => {
    const group = arbitraryGroup();
    const ports: Ports = {
      ...defaultPorts,
      getAllEvents: T.of([
        groupJoined(
          group.id,
          group.name,
          group.avatarPath,
          group.descriptionPath,
          group.shortDescription,
          group.homepage,
          group.slug,
        ),
        evaluationRecorded(group.id, articleId, arbitraryReviewId()),
      ]),
    };
    const result = await pipe(
      { articleId, groupId: group.id },
      generateDocmapViewModel(ports),
      TE.getOrElse(framework.abortTest('generateDocmapViewModel')),
    )();

    expect(result).toStrictEqual(expect.objectContaining({ articleId }));
  });

  it('includes the group', async () => {
    const group = arbitraryGroup();
    const ports: Ports = {
      ...defaultPorts,
      getAllEvents: T.of([
        groupJoined(
          group.id,
          group.name,
          group.avatarPath,
          group.descriptionPath,
          group.shortDescription,
          group.homepage,
          group.slug,
        ),
        evaluationRecorded(group.id, articleId, arbitraryReviewId()),
      ]),
      getGroup: () => O.some(group),
    };
    const result = await pipe(
      { articleId, groupId: group.id },
      generateDocmapViewModel(ports),
      TE.getOrElse(framework.abortTest('generateDocmapViewModel')),
    )();

    expect(result).toStrictEqual(expect.objectContaining({ group }));
  });

  describe('when there are multiple evaluations by the selected group', () => {
    const group = arbitraryGroup();
    const earlierDate = new Date('1900');
    const earlierReviewId = arbitraryReviewId();
    const laterDate = new Date('2000');
    const laterReviewId = arbitraryReviewId();
    let result: DocmapModel;

    beforeEach(async () => {
      const ports: Ports = {
        ...defaultPorts,
        getAllEvents: T.of([
          groupJoined(
            indexedGroupId,
            group.name,
            group.avatarPath,
            group.descriptionPath,
            group.shortDescription,
            group.homepage,
            group.slug,
          ),
          evaluationRecorded(indexedGroupId, articleId, earlierReviewId, [], new Date(), earlierDate),
          evaluationRecorded(indexedGroupId, articleId, laterReviewId, [], new Date(), laterDate),
        ]),
      };
      result = await pipe(
        generateDocmapViewModel(ports)({ articleId, groupId: indexedGroupId }),
        TE.getOrElse(framework.abortTest('generateDocmapViewModel')),
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
      const group = arbitraryGroup();
      const ports: Ports = {
        ...defaultPorts,
        fetchReview: shouldNotBeCalled,
        getAllEvents: T.of([
          groupJoined(
            indexedGroupId,
            group.name,
            group.avatarPath,
            group.descriptionPath,
            group.shortDescription,
            group.homepage,
            group.slug,
          ),
          evaluationRecorded(indexedGroupId, articleId, reviewIdWithInferrableSourceUrl),
        ]),
      };
      result = await pipe(
        generateDocmapViewModel(ports)({ articleId, groupId: indexedGroupId }),
        TE.getOrElse(framework.abortTest('generateDocmapViewModel')),
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
      const group = arbitraryGroup();
      const ports: Ports = {
        ...defaultPorts,
        fetchReview: () => TE.right({ url: sourceUrl }),
        getAllEvents: T.of([
          groupJoined(
            indexedGroupId,
            group.name,
            group.avatarPath,
            group.descriptionPath,
            group.shortDescription,
            group.homepage,
            group.slug,
          ),
          evaluationRecorded(indexedGroupId, articleId, reviewIdWithUninferrableSourceUrl),
        ]),
      };
      result = await pipe(
        generateDocmapViewModel(ports)({ articleId, groupId: indexedGroupId }),
        TE.getOrElse(framework.abortTest('generateDocmapViewModel')),
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
      const result = await generateDocmapViewModel(defaultPorts)({ articleId, groupId: indexedGroupId })();

      expect(result).toStrictEqual(E.left('not-found'));
    });
  });

  describe('when there are evaluations by other groups', () => {
    it('only uses the evaluation by the selected group', async () => {
      const group = {
        ...arbitraryGroup(),
        id: indexedGroupId,
      };
      const otherGroup = arbitraryGroup();
      const evaluationByThisGroup = {
        ...arbitraryRecordedEvaluation(),
        articleId,
        groupId: indexedGroupId,
      };
      await framework.commandHelpers.createGroup(group);
      await framework.commandHelpers.createGroup(otherGroup);
      await framework.commandHelpers.recordEvaluation({
        ...arbitraryRecordedEvaluation(),
        groupId: otherGroup.id,
        articleId,
      });
      await framework.commandHelpers.recordEvaluation(evaluationByThisGroup);

      const result = await pipe(
        {
          articleId,
          groupId: indexedGroupId,
        },
        generateDocmapViewModel(defaultAdapters),
        TE.getOrElse(framework.abortTest('generateDocmapViewModel')),
      )();

      expect(result.evaluations).toStrictEqual([
        expect.objectContaining({
          reviewId: evaluationByThisGroup.reviewId,
        }),
      ]);
    });
  });

  describe('when there is a single evaluation by the selected group', () => {
    const group = arbitraryGroup();
    const evaluation: RecordedEvaluation = {
      ...arbitraryRecordedEvaluation(),
      groupId: indexedGroupId,
      articleId,
    };
    let result: DocmapModel;

    beforeEach(async () => {
      await framework.commandHelpers.createGroup({ ...group, id: indexedGroupId });
      await framework.commandHelpers.recordEvaluation(evaluation);
      result = await pipe(
        {
          articleId,
          groupId: indexedGroupId,
        },
        generateDocmapViewModel(defaultAdapters),
        TE.getOrElse(framework.abortTest('generateDocmapViewModel')),
      )();
    });

    it('returns O.none for the input published date', async () => {
      expect(result.inputPublishedDate).toStrictEqual(O.none);
    });
  });

  describe('when the group cannot be retrieved', () => {
    let result: E.Either<DE.DataError, DocmapModel>;

    beforeEach(async () => {
      result = await pipe(
        {
          articleId,
          groupId: indexedGroupId,
        },
        generateDocmapViewModel(defaultAdapters),
      )();
    });

    it('returns not-found', async () => {
      expect(result).toStrictEqual(E.left('not-found'));
    });
  });
});
