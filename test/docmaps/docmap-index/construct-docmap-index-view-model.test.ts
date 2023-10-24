import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { DocmapIndexViewModel, constructDocmapIndexViewModel } from '../../../src/docmaps/docmap-index/docmap-index';
import { TestFramework, createTestFramework } from '../../framework';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { ArticleId } from '../../../src/types/article-id';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryRecordEvaluationPublicationCommand } from '../../write-side/commands/record-evaluation-publication-command.helper';
import { supportedGroups } from '../../../src/docmaps/supported-groups';
import { arbitraryAddGroupCommand } from '../../write-side/commands/add-group-command.helper';
import { Params } from '../../../src/docmaps/docmap-index/params';
import { publisherAccountId } from '../../../src/docmaps/docmap/publisher-account-id';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';
import { arbitraryString } from '../../helpers';

describe('construct-docmap-index-view-model', () => {
  const defaultParams: Params = {
    updatedAfter: O.none,
    publisheraccount: O.none,
  };
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when there are no docmaps', () => {
    let index: DocmapIndexViewModel;

    beforeEach(async () => {
      index = await pipe(
        defaultParams,
        constructDocmapIndexViewModel(framework.dependenciesForViews),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns an empty list', () => {
      expect(index).toStrictEqual([]);
    });
  });

  describe('when only supported groups are involved', () => {
    let docmapArticleIds: ReadonlyArray<ArticleId>;

    describe('when a single group has evaluated multiple articles', () => {
      const articleId1 = arbitraryArticleId();
      const articleId2 = arbitraryArticleId();
      const groupId = supportedGroups[0];

      beforeEach(async () => {
        await framework.commandHelpers.addGroup({
          ...arbitraryAddGroupCommand(),
          groupId,
        });
        await framework.commandHelpers.recordEvaluationPublication({
          ...arbitraryRecordEvaluationPublicationCommand(),
          articleId: articleId1,
          groupId,
        });
        await framework.commandHelpers.recordEvaluationPublication({
          ...arbitraryRecordEvaluationPublicationCommand(),
          articleId: articleId2,
          groupId,
        });
        docmapArticleIds = await pipe(
          defaultParams,
          constructDocmapIndexViewModel(framework.dependenciesForViews),
          TE.getOrElse(framework.abortTest('constructDocmapIndexViewModel')),
          T.map(RA.map((docmap) => docmap.articleId)),
        )();
      });

      it('returns a docmap for every evaluated article', () => {
        expect(docmapArticleIds).toHaveLength(2);
        expect(docmapArticleIds).toContain(articleId1);
        expect(docmapArticleIds).toContain(articleId2);
      });
    });

    describe('when multiple groups have evaluated a single article', () => {
      it.todo('returns a docmap for every group');
    });

    describe('when multiple groups have evaluated multiple articles', () => {
      it.todo('returns a docmap for every combination of group and evaluated article');
    });
  });

  describe('when an unsupported group is involved', () => {
    it.todo('excludes articles evaluated by the unsupported group');
  });

  describe('filtering', () => {
    let docmapArticleIds: ReadonlyArray<ArticleId>;

    describe('when the whole index is requested', () => {
      const articleId1 = arbitraryArticleId();
      const articleId2 = arbitraryArticleId();
      const groupId1 = supportedGroups[0];
      const groupId2 = supportedGroups[1];

      beforeEach(async () => {
        await framework.commandHelpers.addGroup({
          ...arbitraryAddGroupCommand(),
          groupId: groupId1,
        });
        await framework.commandHelpers.addGroup({
          ...arbitraryAddGroupCommand(),
          groupId: groupId2,
        });
        await framework.commandHelpers.recordEvaluationPublication({
          ...arbitraryRecordEvaluationPublicationCommand(),
          articleId: articleId1,
          groupId: groupId1,
        });
        await framework.commandHelpers.recordEvaluationPublication({
          ...arbitraryRecordEvaluationPublicationCommand(),
          articleId: articleId2,
          groupId: groupId2,
        });
        docmapArticleIds = await pipe(
          defaultParams,
          constructDocmapIndexViewModel(framework.dependenciesForViews),
          TE.getOrElse(framework.abortTest('constructDocmapIndexViewModel')),
          T.map(RA.map((docmap) => docmap.articleId)),
        )();
      });

      it('returns all docmaps', () => {
        expect(docmapArticleIds).toHaveLength(2);
        expect(docmapArticleIds).toContain(articleId1);
        expect(docmapArticleIds).toContain(articleId2);
      });
    });

    describe('when a particular publisher account ID is requested', () => {
      const articleId = arbitraryArticleId();
      const groupId1 = supportedGroups[0];
      const addGroup1Command = {
        ...arbitraryAddGroupCommand(),
        groupId: groupId1,
      };
      const groupId2 = supportedGroups[1];

      beforeEach(async () => {
        await framework.commandHelpers.addGroup(addGroup1Command);
        await framework.commandHelpers.addGroup({
          ...arbitraryAddGroupCommand(),
          groupId: groupId2,
        });
        await framework.commandHelpers.recordEvaluationPublication({
          ...arbitraryRecordEvaluationPublicationCommand(),
          articleId,
          groupId: groupId1,
        });
        await framework.commandHelpers.recordEvaluationPublication({
          ...arbitraryRecordEvaluationPublicationCommand(),
          groupId: groupId2,
        });
        docmapArticleIds = await pipe(
          {
            ...defaultParams,
            publisheraccount: O.some(publisherAccountId(addGroup1Command)),
          },
          constructDocmapIndexViewModel(framework.dependenciesForViews),
          TE.getOrElse(framework.abortTest('constructDocmapIndexViewModel')),
          T.map(RA.map((docmap) => docmap.articleId)),
        )();
      });

      it('only returns docmaps by the corresponding group', () => {
        expect(docmapArticleIds).toStrictEqual([articleId]);
      });
    });

    describe('when only docmaps updated after a certain date are requested', () => {
      describe('when one evaluation has been recorded before that date and another has been recorded after that date', () => {
        const relevantArticleId = arbitraryArticleId();
        const groupId = supportedGroups[0];

        beforeEach(async () => {
          await framework.commandHelpers.addGroup({
            ...arbitraryAddGroupCommand(),
            groupId,
          });
          await framework.commandHelpers.recordEvaluationPublication({
            ...arbitraryRecordEvaluationPublicationCommand(),
            issuedAt: new Date('1980-01-01'),
            groupId,
          });
          await framework.commandHelpers.recordEvaluationPublication({
            ...arbitraryRecordEvaluationPublicationCommand(),
            articleId: relevantArticleId,
            issuedAt: new Date('2000-01-01'),
            groupId,
          });
          docmapArticleIds = await pipe(
            {
              ...defaultParams,
              updatedAfter: O.some(new Date('1990-01-01')),
            },
            constructDocmapIndexViewModel(framework.dependenciesForViews),
            TE.getOrElse(framework.abortTest('constructDocmapIndexViewModel')),
            T.map(RA.map((docmap) => docmap.articleId)),
          )();
        });

        it('returns the docmap whose updated property is after the specified date', () => {
          expect(docmapArticleIds).toStrictEqual([relevantArticleId]);
        });
      });

      describe('when one evaluation has been recorded before that date and then updated after that date', () => {
        const relevantArticleId = arbitraryArticleId();
        const groupId = supportedGroups[0];
        const evaluationLocator = arbitraryEvaluationLocator();

        beforeEach(async () => {
          await framework.commandHelpers.addGroup({
            ...arbitraryAddGroupCommand(),
            groupId,
          });
          await framework.commandHelpers.recordEvaluationPublication({
            ...arbitraryRecordEvaluationPublicationCommand(),
            articleId: relevantArticleId,
            evaluationLocator,
            issuedAt: new Date('1980-01-01'),
            groupId,
          });
          await framework.commandHelpers.updateEvaluation({
            evaluationLocator,
            authors: [arbitraryString()],
            issuedAt: new Date('2000-01-01'),
          });
          docmapArticleIds = await pipe(
            {
              ...defaultParams,
              updatedAfter: O.some(new Date('1990-01-01')),
            },
            constructDocmapIndexViewModel(framework.dependenciesForViews),
            TE.getOrElse(framework.abortTest('constructDocmapIndexViewModel')),
            T.map(RA.map((docmap) => docmap.articleId)),
          )();
        });

        it('returns that docmap', () => {
          expect(docmapArticleIds).toStrictEqual([relevantArticleId]);
        });
      });
    });
  });

  describe('when one of the docmaps requires a third-party query to construct', () => {
    describe('when the third-party query succeeds', () => {
      it.todo('returns the docmap as part of the index');
    });

    describe('when the third-party query fails', () => {
      it.todo('fails to produce an index');
    });
  });
});
