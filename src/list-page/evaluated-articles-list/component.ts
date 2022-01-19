import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { evaluatedArticles } from './evaluated-articles';
import { noEvaluatedArticlesMessage } from './static-messages';
import { toPageOfCards, Ports as ToPageOfCardsPorts } from './to-page-of-cards';
import { DomainEvent } from '../../domain-events';
import { PageOfItems, paginate } from '../../shared-components/paginate';
import { getActivityForDois } from '../../shared-read-models/article-activity/get-activity-for-dois';
import { ArticleActivity } from '../../types/article-activity';
import * as DE from '../../types/data-error';
import { Group } from '../../types/group';
import { HtmlFragment } from '../../types/html-fragment';

export type Ports = ToPageOfCardsPorts & {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

const overrideArticleActivities = (ports: Ports) => (pageOfItems: PageOfItems<ArticleActivity>) => pipe(
  pageOfItems.items,
  RA.map((item) => item.doi),
  (dois) => pipe(
    ports.getAllEvents,
    T.map(getActivityForDois(dois)),
  ),
  T.map((items) => ({
    ...pageOfItems,
    items,
  })),
);

export const component = (
  ports: Ports,
  group: Group,
  pageNumber: number,
): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  ports.getAllEvents,
  TE.rightTask,
  TE.map(evaluatedArticles(group.id)),
  TE.chain(RA.match(
    () => TE.right(noEvaluatedArticlesMessage),
    flow(
      paginate(20, pageNumber),
      TE.fromEither,
      TE.chainTaskK(overrideArticleActivities(ports)),
      TE.chainTaskK(toPageOfCards(ports, group)),
    ),
  )),
);
