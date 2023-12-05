import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { sequenceS } from 'fp-ts/Apply';
import * as RA from 'fp-ts/ReadonlyArray';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as O from 'fp-ts/Option';
import { URL } from 'url';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { feedSummary } from './feed-summary';
import { getArticleFeedEventsByDateDescending } from './get-article-feed-events';
import * as DE from '../../../types/data-error';
import { ViewModel } from '../view-model';
import { userIdCodec } from '../../../types/user-id';
import { constructListedIn } from './construct-listed-in';
import { constructUserListManagement } from './construct-user-list-management';
import { constructRelatedArticles } from './construct-related-articles';
import { detectLanguage } from '../../../shared-components/lang-attribute';
import { constructCurationStatements } from '../../../shared-components/curation-statements';
import { Dependencies } from './dependencies';
import { constructReviewingGroups } from '../../../shared-components/reviewing-groups';
import { PaperExpressionLocator, PaperId } from '../../../third-parties';
import { PaperExpressionFrontMatter } from '../../../third-parties/external-queries';
import { PaperIdThatIsADoi } from '../../../third-parties/paper-id';
import { ArticleServer } from '../../../types/article-server';

export const paramsCodec = t.type({
  paperId: PaperId.paperIdCodec,
  user: tt.optionFromNullable(t.type({ id: userIdCodec })),
});

type Params = t.TypeOf<typeof paramsCodec>;

const toFullArticleUrl = (paperId: PaperId.PaperIdThatIsADoi) => `https://doi.org/${PaperId.getDoiPortion(paperId)}`;

type ConstructViewModel = (dependencies: Dependencies) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

const getFrontMatterForMostRecentExpression = (dependencies: Dependencies) => (paperId: PaperId.PaperIdThatIsADoi): ReturnType<Dependencies['fetchPaperExpressionFrontMatter']> => pipe(
  paperId,
  PaperId.getDoiPortion,
  PaperExpressionLocator.fromDoi,
  dependencies.fetchPaperExpressionFrontMatter,
);

const constructRemainingViewModelForDoi = (
  dependencies: Dependencies,
  params: Params,
  paperId: PaperIdThatIsADoi,
) => (frontMatter: PaperExpressionFrontMatter) => pipe(
  {
    feedItemsByDateDescending: getArticleFeedEventsByDateDescending(dependencies)(paperId, frontMatter.server),
    relatedArticles: constructRelatedArticles(frontMatter.doi, dependencies),
    curationStatements: constructCurationStatements(dependencies, frontMatter.doi),
  },
  sequenceS(T.ApplyPar),
  TE.rightTask,
  TE.map(({ curationStatements, feedItemsByDateDescending, relatedArticles }) => ({
    ...frontMatter,
    titleLanguageCode: detectLanguage(frontMatter.title),
    abstractLanguageCode: detectLanguage(frontMatter.abstract),
    userListManagement: constructUserListManagement(params.user, dependencies, frontMatter.doi),
    fullArticleUrl: toFullArticleUrl(paperId),
    feedItemsByDateDescending,
    ...feedSummary(feedItemsByDateDescending),
    listedIn: constructListedIn(dependencies)(frontMatter.doi),
    relatedArticles,
    curationStatements: pipe(
      curationStatements,
      RA.map((curationStatementWithGroupAndContent) => ({
        ...curationStatementWithGroupAndContent,
        fullText: curationStatementWithGroupAndContent.statement,
        fullTextLanguageCode: curationStatementWithGroupAndContent.statementLanguageCode,
      })),
    ),
    reviewingGroups: constructReviewingGroups(dependencies, frontMatter.doi),
  })),
);

export const constructViewModel: ConstructViewModel = (dependencies) => (params) => {
  if (PaperId.isDoi(params.paperId)) {
    return pipe(
      params.paperId,
      getFrontMatterForMostRecentExpression(dependencies),
      TE.chainW(constructRemainingViewModelForDoi(dependencies, params, params.paperId)),
    );
  }

  type PaperExpression = {
    version: number,
    source: URL,
    server: ArticleServer,
    publishedAt: Date,
    locator: PaperExpressionLocator.PaperExpressionLocator,
  };

  const hardcodedPaperExpressions: RNEA.ReadonlyNonEmptyArray<PaperExpression> = [
    {
      version: 3,
      source: new URL('https://doi.org/10.1099/acmi.0.000659.v3'),
      server: 'microbiologyresearch' as const,
      publishedAt: new Date('2023-10-05'),
      locator: PaperExpressionLocator.fromDoi('10.1099/acmi.0.000659.v3'),
    },
    {
      version: 2,
      source: new URL('https://doi.org/10.1099/acmi.0.000659.v2'),
      server: 'microbiologyresearch' as const,
      publishedAt: new Date('2023-09-07'),
      locator: PaperExpressionLocator.fromDoi('10.1099/acmi.0.000659.v2'),
    },
    {
      version: 1,
      source: new URL('https://doi.org/10.1099/acmi.0.000659.v1'),
      server: 'microbiologyresearch' as const,
      publishedAt: new Date('2023-06-29'),
      locator: PaperExpressionLocator.fromDoi('10.1099/acmi.0.000659.v1'),
    },
  ];

  if (params.paperId === 'uuid:54844ee0-0cbd-40a6-8a57-56118412410c') {
    return pipe(
      hardcodedPaperExpressions[0].locator,
      dependencies.fetchPaperExpressionFrontMatter,
      TE.map((frontMatter) => ({
        doi: frontMatter.doi,
        title: frontMatter.title,
        titleLanguageCode: O.none,
        authors: frontMatter.authors,
        fullArticleUrl: '',
        abstract: frontMatter.abstract,
        abstractLanguageCode: O.none,
        evaluationCount: 0,
        latestVersion: O.none,
        latestActivity: O.none,
        feedItemsByDateDescending: pipe(
          hardcodedPaperExpressions,
          RNEA.map((expression) => ({
            ...expression,
            type: 'article-version',
          })),
        ),
        userListManagement: O.none,
        listedIn: [],
        relatedArticles: O.none,
        curationStatements: [],
        reviewingGroups: [],
      })),
    );
  }

  return TE.left(DE.notFound);
};
