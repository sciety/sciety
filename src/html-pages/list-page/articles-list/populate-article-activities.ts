import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { PageOfItems } from '../../../shared-components/paginate';
import { ArticleActivity } from '../../../types/article-activity';
import { Doi } from '../../../types/doi';
import { GetActivityForDoi } from '../../../shared-ports';

export type Ports = {
  getActivityForDoi: GetActivityForDoi,
};

type PopulateArticleActivities = (ports: Ports)
=> (pageOfItems: PageOfItems<Doi>)
=> PageOfItems<ArticleActivity>;

export const populateArticleActivities: PopulateArticleActivities = (ports) => (pageOfItems) => ({
  ...pageOfItems,
  items: pipe(
    pageOfItems.items,
    RA.map(ports.getActivityForDoi),
  ),
});
