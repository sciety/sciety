import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructFeed } from '../../../../../../src/read-side/html-pages/group-page/group-home-page/construct-view-model/construct-feed';
import { Dependencies } from '../../../../../../src/read-side/html-pages/group-page/group-home-page/construct-view-model/dependencies';
import { OrderedArticleCards, ViewModel } from '../../../../../../src/read-side/html-pages/group-page/group-home-page/view-model';
import { ArticleId } from '../../../../../../src/types/article-id';
import { ListId } from '../../../../../../src/types/list-id';
import { dummyLogger } from '../../../../../dummy-logger';
import { createTestFramework, TestFramework } from '../../../../../framework';
import { shouldNotBeCalled } from '../../../../../should-not-be-called';
import { arbitraryExpressionDoi } from '../../../../../types/expression-doi.helper';
import { arbitraryAddGroupCommand } from '../../../../../write-side/commands/add-group-command.helper';

describe('construct-feed', () => {
  let framework: TestFramework;
  let dependencies: Dependencies;
  const addGroupCommand = arbitraryAddGroupCommand();
  let groupEvaluatedArticlesList: ListId;
  const isOrderedArticleCards = (c: ViewModel['feed']): c is OrderedArticleCards => c.tag === 'ordered-article-cards';
  const getContent = () => constructFeed(
    dependencies,
    {
      ...addGroupCommand,
      id: addGroupCommand.groupId,
      largeLogoPath: O.none,
    },
    3,
    1,
  );
  const getContentAsRight = async () => pipe(
    getContent(),
    TE.getOrElse(shouldNotBeCalled),
  )();
  const getContentAsOrderedArticleCards = async () => pipe(
    getContent(),
    TE.filterOrElseW(isOrderedArticleCards, shouldNotBeCalled),
    TE.getOrElse(shouldNotBeCalled),
  )();

  const getPaperActivityHrefs = (orderedArticleCards: OrderedArticleCards) => pipe(
    orderedArticleCards.articleCards,
    RA.rights,
    RA.map((card) => card.paperActivityPageHref),
  );

  beforeEach(async () => {
    framework = createTestFramework();
    dependencies = {
      ...framework.queries,
      ...framework.happyPathThirdParties,
      logger: dummyLogger,
    };
    await framework.commandHelpers.addGroup(addGroupCommand);
    groupEvaluatedArticlesList = pipe(
      framework.queries.getEvaluatedArticlesListIdForGroup(addGroupCommand.groupId),
      O.getOrElseW(shouldNotBeCalled),
    );
  });

  describe('when the group\'s evaluated articles list contains two articles', () => {
    const expressionDoi1 = arbitraryExpressionDoi();
    const expressionDoi2 = arbitraryExpressionDoi();
    let paperActivityHrefs: ReadonlyArray<string>;
    let nextPageHref: O.Option<string>;

    beforeEach(async () => {
      await framework.commandHelpers.addArticleToList({
        articleId: new ArticleId(expressionDoi1),
        listId: groupEvaluatedArticlesList,
      });
      await framework.commandHelpers.addArticleToList({
        articleId: new ArticleId(expressionDoi2),
        listId: groupEvaluatedArticlesList,
      });

      const orderedArticleCards = await getContentAsOrderedArticleCards();
      paperActivityHrefs = getPaperActivityHrefs(orderedArticleCards);
      nextPageHref = orderedArticleCards.forwardPageHref;
    });

    it('has the most recently added article as the first article card', () => {
      expect(paperActivityHrefs[0]).toContain(expressionDoi2);
      expect(paperActivityHrefs[1]).toContain(expressionDoi1);
    });

    it('does not have a next page link', () => {
      expect(nextPageHref).toStrictEqual(O.none);
    });
  });

  describe('when the group\'s evaluated articles list contains more than one page of articles', () => {
    const expressionDoi1 = arbitraryExpressionDoi();
    const expressionDoi2 = arbitraryExpressionDoi();
    const expressionDoi3 = arbitraryExpressionDoi();
    const expressionDoi4 = arbitraryExpressionDoi();
    let paperActivityHrefs: ReadonlyArray<string>;
    let nextPageHref: O.Option<string>;

    beforeEach(async () => {
      await framework.commandHelpers.addArticleToList({
        articleId: new ArticleId(expressionDoi1),
        listId: groupEvaluatedArticlesList,
      });
      await framework.commandHelpers.addArticleToList({
        articleId: new ArticleId(expressionDoi2),
        listId: groupEvaluatedArticlesList,
      });
      await framework.commandHelpers.addArticleToList({
        articleId: new ArticleId(expressionDoi3),
        listId: groupEvaluatedArticlesList,
      });
      await framework.commandHelpers.addArticleToList({
        articleId: new ArticleId(expressionDoi4),
        listId: groupEvaluatedArticlesList,
      });

      const orderedArticleCards = await getContentAsOrderedArticleCards();
      paperActivityHrefs = getPaperActivityHrefs(orderedArticleCards);
      nextPageHref = orderedArticleCards.forwardPageHref;
    });

    it('has the most recently added article as the first article card', () => {
      expect(paperActivityHrefs[0]).toContain(expressionDoi4);
      expect(paperActivityHrefs[1]).toContain(expressionDoi3);
      expect(paperActivityHrefs[2]).toContain(expressionDoi2);
    });

    it('does have a link to the next page', () => {
      expect(nextPageHref).toStrictEqual(O.some(expect.stringContaining('page=2')));
    });
  });

  describe('when the group\'s evaluated articles list is empty', () => {
    let content: ViewModel['feed'];

    beforeEach(async () => {
      content = await getContentAsRight();
    });

    it('contains a no-activity-yet message', () => {
      expect(content.tag).toBe('no-activity-yet');
    });
  });
});
