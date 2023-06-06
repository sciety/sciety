import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { sequenceS } from 'fp-ts/Apply';
import { feedSummary } from './feed-summary';
import {
  getArticleFeedEventsByDateDescending,
  Ports as GetArticleFeedEventsPorts,
} from './get-article-feed-events';
import { ArticleAuthors } from '../../../types/article-authors';
import { ArticleServer } from '../../../types/article-server';
import * as DE from '../../../types/data-error';
import { Doi } from '../../../types/doi';
import { SanitisedHtmlFragment } from '../../../types/sanitised-html-fragment';
import { CurationStatement, ViewModel } from '../view-model';
import { UserId } from '../../../types/user-id';
import { constructListedIn, Ports as ConstructListedInPorts } from './construct-listed-in';
import { constructUserListManagement, Ports as ConstructUserListManagementPorts } from './construct-user-list-management';
import { constructRelatedArticles, Ports as ConstructRelatedArticlesPorts } from './construct-related-articles';
import { detectLanguage } from '../../../shared-components/lang-attribute';

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

export type Ports = GetArticleFeedEventsPorts
& ConstructListedInPorts
& ConstructUserListManagementPorts
& ConstructRelatedArticlesPorts
& {
  fetchArticle: GetArticleDetails,
};

const curationStatements: ReadonlyArray<CurationStatement> = [
  {
    groupName: 'eLife',
    groupLargeLogo: '/static/images/home-page/elife.svg',
    statement: `
      <div lang="en">
        <p><strong>eLife assessment</strong></p>
        <p>This fundamental study presents solid evidence for T1r (sweet /umami) taste receptors as chloride (Cl-) receptors, based on a combination of state-of-the-art techniques to demonstrate that T1r receptors from Medaka fish bind chloride and that this binding induces a conformational change in the heteromeric receptor. This conformational change leads to low-concentration chloride-specific action potential firing in nerves from neurons containing these receptors in mice, results that represent an important advance in our understanding of the logic of taste perception.</p>
      </div>
    `,
  },
  {
    groupName: 'Biophysics Colab',
    groupLargeLogo: '/static/images/home-page/biophysics-colab.png',
    statement: `
      <div lang="en">
        <p><strong>Endorsement statement (17 November 2022)</strong></p>
        <p>The preprint by Atsumi <em>et al</em>. describes how chloride binding to sweet- and umami-sensing proteins (T1R taste receptors) can evoke taste sensation. The authors use an elegant combination of structural, biophysical and electrophysiological approaches to locate a chloride binding site in the ligand-binding domain of medaka fish T1r2a/3 receptors. They convincingly show that low mM concentrations of chloride induce conformational changes and, using single fiber recordings, establish that mouse chorda tympani nerves are activated by chloride in a T1R-dependent manner. This suggests that chloride binding to sweet receptors could mediate the commonly reported sweet taste sensation following ingestion of low concentrations of table salt. The findings will be of broad relevance to those studying taste sensation and ligand recognition in GPCRs.</p>
        <p><em>(This endorsement by Biophysics Colab refers to version 2 of this preprint, which has been revised in response to peer review of version 1.)</em></p>
      </div>
    `,
  },
];

type ConstructViewModel = (ports: Ports) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (ports) => (params) => pipe(
  ports.fetchArticle(params.doi),
  TE.chainW((articleDetails) => pipe(
    {
      feedItemsByDateDescending: getArticleFeedEventsByDateDescending(ports)(params.doi, articleDetails.server),
      relatedArticles: constructRelatedArticles(params.doi, ports),
    },
    sequenceS(T.ApplyPar),
    TE.rightTask,
    TE.map(({ feedItemsByDateDescending, relatedArticles }) => ({
      ...articleDetails,
      titleLanguageCode: detectLanguage(articleDetails.title),
      abstractLanguageCode: detectLanguage(articleDetails.abstract),
      userListManagement: constructUserListManagement(params.user, ports, params.doi),
      fullArticleUrl: `https://doi.org/${params.doi.value}`,
      feedItemsByDateDescending,
      ...feedSummary(feedItemsByDateDescending),
      listedIn: constructListedIn(ports)(params.doi),
      relatedArticles,
      curationStatements: (params.doi.value === '10.1101/2022.02.23.481615') ? curationStatements : [],
    })),
  )),
);
