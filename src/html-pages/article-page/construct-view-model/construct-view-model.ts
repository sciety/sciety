import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { detect } from 'tinyld';
import { feedSummary } from './feed-summary';
import {
  getArticleFeedEventsByDateDescending,
  Ports as GetArticleFeedEventsPorts,
} from './get-article-feed-events';
import { ArticleAuthors } from '../../../types/article-authors';
import { ArticleServer } from '../../../types/article-server';
import * as DE from '../../../types/data-error';
import { Doi } from '../../../types/doi';
import { sanitise, SanitisedHtmlFragment } from '../../../types/sanitised-html-fragment';
import { ViewModel } from '../view-model';
import { UserId } from '../../../types/user-id';
import { constructListedIn, Ports as ConstructListedInPorts } from './construct-listed-in';
import { constructUserListManagement, Ports as ConstructUserListManagementPorts } from './construct-user-list-management';
import { toHtmlFragment } from '../../../types/html-fragment';

export type Params = {
  doi: Doi,
  user: O.Option<{ id: UserId }>,
};

type GetArticleDetails = (doi: Doi) => TE.TaskEither<DE.DataError, {
  doi: Doi,
  title: SanitisedHtmlFragment,
  abstract: SanitisedHtmlFragment, // TODO Use HtmlFragment as the HTML is stripped
  server: ArticleServer,
  authors: ArticleAuthors,
}>;

export type Ports = GetArticleFeedEventsPorts & ConstructListedInPorts & ConstructUserListManagementPorts & {
  fetchArticle: GetArticleDetails,
};

const hardcodedRelatedArticles = [
  {
    articleId: new Doi('10.1101/2023.03.24.534097'),
    title: sanitise(toHtmlFragment('Replication fork plasticity upon replication stress requires rapid nuclear actin polymerization')),
    authors: O.some(['Maria Dilia Palumbieri', 'C. Merigliano']),
    latestVersionDate: O.none,
    latestActivityAt: O.none,
    evaluationCount: 0,
    listMembershipCount: 0,
  },
  {
    articleId: new Doi('10.1101/2023.03.21.533689'),
    title: sanitise(toHtmlFragment('An endocytic myosin essential for plasma membrane invagination powers motility against resistance')),
    authors: O.some(['Ross T A Pedersen', 'Aaron Snoberger']),
    latestVersionDate: O.none,
    latestActivityAt: O.none,
    evaluationCount: 0,
    listMembershipCount: 0,
  },
];

type ConstructViewModel = (ports: Ports) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (ports) => (params) => pipe(
  ports.fetchArticle(params.doi),
  TE.chainW((articleDetails) => pipe(
    getArticleFeedEventsByDateDescending(ports)(
      params.doi, articleDetails.server, pipe(params.user, O.map(({ id }) => id)),
    ),
    TE.rightTask,
    TE.map((feedItemsByDateDescending) => ({
      ...articleDetails,
      titleLanguageCode: detect(articleDetails.title, { only: ['en', 'es', 'pt'] }),
      userListManagement: constructUserListManagement(params.user, ports, params.doi),
      fullArticleUrl: `https://doi.org/${params.doi.value}`,
      feedItemsByDateDescending,
      ...feedSummary(feedItemsByDateDescending),
      listedIn: constructListedIn(ports)(params.doi),
      relatedArticles: (process.env.EXPERIMENT_ENABLED === 'true') ? hardcodedRelatedArticles : [],
    })),
  )),
);
