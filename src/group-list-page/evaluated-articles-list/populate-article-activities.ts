import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../domain-events';
import { PageOfItems } from '../../shared-components/paginate';
import { getActivityForDois } from '../../shared-read-models/article-activity/get-activity-for-dois';
import { ArticleActivity } from '../../types/article-activity';
import { Doi } from '../../types/doi';

type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

type PopulateArticleActivities = (ports: Ports)
=> (pageOfItems: PageOfItems<Doi>)
=> T.Task<PageOfItems<ArticleActivity>>;

export const populateArticleActivities: PopulateArticleActivities = (ports) => (pageOfItems) => pipe(
  pageOfItems.items,
  (dois) => pipe(
    ports.getAllEvents,
    T.map(getActivityForDois(dois)),
  ),
  T.map((items) => ({
    ...pageOfItems,
    items,
  })),
);
