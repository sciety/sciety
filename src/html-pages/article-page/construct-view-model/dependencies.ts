import { Queries } from '../../../read-models';
import {
  FetchArticle,
  FetchRelatedArticles,
  FetchReview,
  FindVersionsForArticleDoi,
  Logger,
} from '../../../shared-ports';
import { Dependencies as ConstructCurationStatementsDependencies } from '../../../shared-components/curation-statements/construct-curation-statements';
import { ConstructGroupLinkDependencies } from '../../../shared-components/group-link';

export type Dependencies = Queries
& ConstructCurationStatementsDependencies
& ConstructGroupLinkDependencies
& {
  fetchArticle: FetchArticle,
  fetchRelatedArticles: FetchRelatedArticles,
  fetchReview: FetchReview,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  logger: Logger,
};
