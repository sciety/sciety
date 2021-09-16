import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { constant, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import {
  collapseCloseEvents,
  CollapsedEvent,
  isCollapsedGroupEvaluatedArticle,
  isCollapsedGroupEvaluatedMultipleArticles,
} from './collapse-close-events';
import { DomainEvent } from '../domain-events';
import { isGroupEvaluatedArticleEvent } from '../domain-events/type-guards';
import { templateDate } from '../shared-components/date';
import { templateListItems } from '../shared-components/list-items';
import * as DE from '../types/data-error';
import { Group } from '../types/group';
import { GroupId } from '../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

const renderContent = (items: ReadonlyArray<HtmlFragment>) => toHtmlFragment(`
  <h1>All events</h1>
  <ol class="all-events-list">
    ${templateListItems(items, 'all-events-list__item')}
  </ol>
`);

export const allEventsCodec = t.type({
  page: tt.withFallback(tt.NumberFromString, 1),
});

type GetGroup = (id: GroupId) => TO.TaskOption<Group>;

type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  getGroup: GetGroup,
};

type Params = t.TypeOf<typeof allEventsCodec> & {
  pageSize: number,
};

const renderGenericEvent = (event: DomainEvent | CollapsedEvent) => toHtmlFragment(`
  <article class="all-events-card">
    ${JSON.stringify(event, null, 2)}
  </article>
`);

const eventCard = (
  getGroup: GetGroup,
) => (
  event: DomainEvent | CollapsedEvent,
): TE.TaskEither<DE.DataError, HtmlFragment> => {
  if (isCollapsedGroupEvaluatedMultipleArticles(event)) {
    return pipe(
      event.groupId,
      getGroup,
      TO.map((group) => `
        <article class="all-events-card">
          <img src="${group.avatarPath}" alt="" width="36" height="36">
          <span>${group.name} evaluated ${event.articleCount} articles. ${templateDate(event.date)}</span>
        </article>
      `),
      TO.map(toHtmlFragment),
      T.map(E.fromOption(constant(DE.unavailable))),
    );
  }

  if (isCollapsedGroupEvaluatedArticle(event) || isGroupEvaluatedArticleEvent(event)) {
    return pipe(
      {
        group: pipe(
          event.groupId,
          getGroup,
          T.map(E.fromOption(constant(DE.unavailable))),
        ),
        article: TE.right({ title: toHtmlFragment('An article title') }),
      },
      sequenceS(TE.ApplyPar),
      TE.map(({ group, article }) => `
        <article class="all-events-card">
          <img src="${group.avatarPath}" alt="" width="36" height="36">
          <span>${group.name} evaluated an article. ${templateDate(event.date)}</span>
          ${article.title}
        </article>
      `),
      TE.map(toHtmlFragment),
    );
  }

  return TE.right(renderGenericEvent(event));
};

export const allEventsPage = (ports: Ports) => (params: Params): TE.TaskEither<RenderPageError, Page> => pipe(
  ports.getAllEvents,
  T.map(RA.reverse),
  T.map(collapseCloseEvents),
  T.map((events) => events.slice(
    (params.page - 1) * params.pageSize,
    params.page * params.pageSize,
  )),
  T.chain(TE.traverseArray(eventCard(ports.getGroup))),
  TE.bimap(
    () => ({ type: DE.unavailable, message: toHtmlFragment('invalid groupId') }),
    (items) => ({
      title: 'All events',
      content: renderContent(items),
    }),
  ),
);
