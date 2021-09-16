import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { allEventsPage } from '../../src/all-events-page/all-events-page';
import { groupEvaluatedArticle } from '../../src/domain-events';
import { arbitraryHtmlFragment } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryGroup } from '../types/group.helper';
import { arbitraryReviewId } from '../types/review-id.helper';

describe('all-events-page', () => {
  it.skip('renders collapsed single article evaluated events as a single card', async () => {
    const group = arbitraryGroup();
    const articleId = arbitraryDoi();
    const articleTitle = arbitraryHtmlFragment();
    const ports = {
      fetchArticle: () => TE.right({
        title: articleTitle,
      }),
      getGroup: () => TO.some(group),
      getAllEvents: T.of([
        groupEvaluatedArticle(group.id, articleId, arbitraryReviewId()),
        groupEvaluatedArticle(group.id, articleId, arbitraryReviewId()),
      ]),
    };
    const renderedPage = await pipe(
      allEventsPage(ports)({ page: 1, pageSize: 20 }),
      T.map(E.getOrElseW(shouldNotBeCalled)),
      T.map((page) => page.content),
    )();

    expect(renderedPage).toContain(`${group.name} evaluated an article`);
    expect(renderedPage).toContain(articleTitle);
  });

  it('renders collapsed multiple article evaluated events as a single card', async () => {
    const group = arbitraryGroup();
    const ports = {
      getGroup: () => TO.some(group),
      getAllEvents: T.of([
        groupEvaluatedArticle(group.id, arbitraryDoi(), arbitraryReviewId()),
        groupEvaluatedArticle(group.id, arbitraryDoi(), arbitraryReviewId()),
      ]),
    };
    const renderedPage = await pipe(
      allEventsPage(ports)({ page: 1, pageSize: 20 }),
      T.map(E.getOrElseW(shouldNotBeCalled)),
      T.map((page) => page.content),
    )();

    expect(renderedPage).toContain(`${group.name} evaluated 2 articles`);
  });

  it('renders a single evaluation as a card', async () => {
    const group = arbitraryGroup();
    const articleId = arbitraryDoi();
    const ports = {
      getGroup: () => TO.some(group),
      getAllEvents: T.of([
        groupEvaluatedArticle(group.id, articleId, arbitraryReviewId()),
      ]),
    };
    const renderedPage = await pipe(
      allEventsPage(ports)({ page: 1, pageSize: 20 }),
      T.map(E.getOrElseW(shouldNotBeCalled)),
      T.map((page) => page.content),
    )();

    expect(renderedPage).toContain(`${group.name} evaluated an article`);
  });

  it('renders at most a page of cards at a time', async () => {
    const events = [
      groupEvaluatedArticle(arbitraryGroupId(), arbitraryDoi(), arbitraryReviewId()),
      groupEvaluatedArticle(arbitraryGroupId(), arbitraryDoi(), arbitraryReviewId()),
      groupEvaluatedArticle(arbitraryGroupId(), arbitraryDoi(), arbitraryReviewId()),
    ];
    const ports = {
      getGroup: () => TO.some(arbitraryGroup()),
      getAllEvents: T.of(events),
    };
    const pageSize = events.length - 1;
    const renderedPage = await pipe(
      allEventsPage(ports)({ page: 1, pageSize }),
      T.map(E.getOrElseW(shouldNotBeCalled)),
      T.map((page) => page.content),
    )();
    const html = JSDOM.fragment(renderedPage);
    const itemCount = Array.from(html.querySelectorAll('.all-events-card')).length;

    expect(itemCount).toStrictEqual(pageSize);
  });
});
