import * as T from 'fp-ts/Task';
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
=> PageOfItems<ArticleActivity>;

export const populateArticleActivities: PopulateArticleActivities = (ports) => (pageOfItems) => ({
  ...pageOfItems,
  items: ports.getActivityForDois(pageOfItems.items),
});
