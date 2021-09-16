import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { allEventsPage } from '../../src/all-events-page/all-events-page';
import { groupEvaluatedArticle } from '../../src/domain-events';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroup } from '../types/group.helper';
import { arbitraryReviewId } from '../types/review-id.helper';

describe('all-events-page', () => {
  it.todo('renders collapsed single article evaluated events as a single card');

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
      allEventsPage(ports)({ page: 1 }),
      T.map(E.getOrElseW(shouldNotBeCalled)),
      T.map((page) => page.content),
    )();

    expect(renderedPage).toContain(`${group.name} evaluated 2 articles`);
  });

  it.todo('renders a single evaluation as a card');

  it.todo('renders at most 20 cards at a time');
});
