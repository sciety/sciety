import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { scietyFeedPage } from '../../../src/html-pages/sciety-feed-page/sciety-feed-page';
import { Ports } from '../../../src/html-pages/sciety-feed-page/construct-view-model/construct-view-model';
import { dummyLogger } from '../../dummy-logger';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryList } from '../../types/list-helper';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';
import { arbitraryUserId } from '../../types/user-id.helper';
import { TestFramework, createTestFramework } from '../../framework';

describe('sciety-feed-page', () => {
  const group = arbitraryGroup();
  let framework: TestFramework;
  let defaultPorts: Ports;

  beforeEach(() => {
    framework = createTestFramework();
    defaultPorts = {
      ...framework.queries,
      logger: dummyLogger,
      getAllEvents: framework.getAllEvents,
    };
  });

  it('renders a single article added to a list as a card', async () => {
    const list = arbitraryList();
    await framework.commandHelpers.createList(list);
    await framework.commandHelpers.addArticleToList(arbitraryArticleId(), list.id);
    const renderedPage = await pipe(
      scietyFeedPage(defaultPorts)(20)({ page: 1 }),
      T.map(E.getOrElseW(shouldNotBeCalled)),
      T.map((page) => page.content),
    )();

    expect(renderedPage).toContain('added an article to a list');
  });

  it('renders a single user followed editorial community as a card', async () => {
    await framework.commandHelpers.createGroup(group);
    await framework.commandHelpers.followGroup(arbitraryUserId(), group.id);
    const renderedPage = await pipe(
      scietyFeedPage(defaultPorts)(20)({ page: 1 }),
      T.map(E.getOrElseW(shouldNotBeCalled)),
      T.map((page) => page.content),
    )();

    expect(renderedPage).toContain('followed a group');
  });

  it('renders at most a page of cards at a time', async () => {
    await framework.commandHelpers.createGroup(group);
    await framework.commandHelpers.followGroup(arbitraryUserId(), group.id);
    await framework.commandHelpers.followGroup(arbitraryUserId(), group.id);
    await framework.commandHelpers.followGroup(arbitraryUserId(), group.id);
    const pageSize = 3;
    const renderedPage = await pipe(
      scietyFeedPage(defaultPorts)(pageSize)({ page: 1 }),
      T.map(E.getOrElseW(shouldNotBeCalled)),
      T.map((page) => page.content),
    )();
    const html = JSDOM.fragment(renderedPage);
    const itemCount = Array.from(html.querySelectorAll('.sciety-feed-card')).length;

    expect(itemCount).toStrictEqual(pageSize);
  });

  it('does not render uninteresting events', async () => {
    const articleId = arbitraryArticleId();
    const list = arbitraryList();
    const userId = arbitraryUserId();
    const evaluationLocator = arbitraryEvaluationLocator();
    await framework.commandHelpers.createGroup(group);
    await framework.commandHelpers.createList(list);
    await framework.commandHelpers.addArticleToList(articleId, list.id);
    await framework.commandHelpers.removeArticleFromList(articleId, list.id);
    await framework.commandHelpers.respond('respond-helpful', evaluationLocator, userId);
    await framework.commandHelpers.respond('revoke-response', evaluationLocator, userId);
    await framework.commandHelpers.respond('respond-not-helpful', evaluationLocator, userId);
    await framework.commandHelpers.respond('revoke-response', evaluationLocator, userId);
    await framework.commandHelpers.unfollowGroup(userId, group.id);
    const renderedPage = await pipe(
      scietyFeedPage(defaultPorts)(10)({ page: 1 }),
      T.map(E.getOrElseW(shouldNotBeCalled)),
      T.map((page) => page.content),
    )();
    const html = JSDOM.fragment(renderedPage);
    const itemCount = Array.from(html.querySelectorAll('.sciety-feed-card')).length;

    expect(itemCount).toBe(1);
  });
});
