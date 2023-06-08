import * as TE from 'fp-ts/TaskEither';
import { Queries } from '../../../shared-read-models';
import { Ports as GetArticleFeedEventsPorts } from './get-article-feed-events';
import { Ports as ConstructListedInPorts } from './construct-listed-in';
import { Ports as ConstructUserListManagementPorts } from './construct-user-list-management';
import { Ports as ConstructRelatedArticlesPorts } from './construct-related-articles';
import { Doi } from '../../../types/doi';
import * as DE from '../../../types/data-error';
import { SanitisedHtmlFragment } from '../../../types/sanitised-html-fragment';
import { ArticleServer } from '../../../types/article-server';
import { ArticleAuthors } from '../../../types/article-authors';

type GetArticleDetails = (doi: Doi) => TE.TaskEither<DE.DataError, {
  doi: Doi,
  title: SanitisedHtmlFragment,
  abstract: SanitisedHtmlFragment, // TODO Use HtmlFragment as the HTML is stripped
  server: ArticleServer,
  authors: ArticleAuthors,
}>;

export type Dependencies = Queries & GetArticleFeedEventsPorts
& ConstructListedInPorts
& ConstructUserListManagementPorts
& ConstructRelatedArticlesPorts
& {
  fetchArticle: GetArticleDetails,
};
