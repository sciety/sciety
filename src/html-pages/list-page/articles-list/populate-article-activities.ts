import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../../domain-events';
import { PageOfItems } from '../../../shared-components/paginate';
import { ArticleActivity } from '../../../types/article-activity';
import { Doi } from '../../../types/doi';
import { GetActivityForDois } from '../../../shared-ports';

export type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  getActivityForDois: GetActivityForDois,
};

type PopulateArticleActivities = (ports: Ports)
=> (pageOfItems: PageOfItems<Doi>)
=> T.Task<PageOfItems<ArticleActivity>>;

export const populateArticleActivities: PopulateArticleActivities = (ports) => (pageOfItems) => pipe(
  pageOfItems.items,
  (dois) => pipe(
    ports.getActivityForDois(dois),
    T.of,
  ),
  T.map((items) => ({
    ...pageOfItems,
    items,
  })),
);
