import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { renderSavedArticles } from './render-saved-articles';
import { informationUnavailable, noSavedArticles } from './static-messages';
import { DomainEvent } from '../../domain-events';
import { renderUnsaveForm } from '../../save-article/render-unsave-form';
import { renderArticleCard } from '../../shared-components/article-card';
import { FindVersionsForArticleDoi, getLatestArticleVersionDate } from '../../shared-components/article-card/get-latest-article-version-date';
import { populateArticleViewModel } from '../../shared-components/article-card/populate-article-view-model';
import { ArticleAuthors } from '../../types/article-authors';
import { ArticleServer } from '../../types/article-server';
import { Doi } from '../../types/doi';
import { HtmlFragment } from '../../types/html-fragment';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';
import { UserId } from '../../types/user-id';

type FetchArticle = (articleId: Doi) => TE.TaskEither<unknown, {
  doi: Doi,
  server: ArticleServer,
  title: SanitisedHtmlFragment,
  authors: ArticleAuthors,
}>;

export type Ports = {
  fetchArticle: FetchArticle,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

type SavedArticles = (ports: Ports) => (
  dois: ReadonlyArray<Doi>,
  loggedInUser: O.Option<UserId>,
  listOwnerId: UserId,
) => T.Task<HtmlFragment>;

const getArticleCardControls = (loggedInUserId: O.Option<UserId>, listOwnerId: UserId, articleId: Doi) => pipe(
  loggedInUserId,
  O.filter((userId) => userId === listOwnerId),
  O.map(() => renderUnsaveForm(articleId)),
);

type GetAnnotationContentByUserListTarget = (articleId: Doi, listOwnerId: UserId)
=> (events: ReadonlyArray<DomainEvent>)
=> string | undefined;

const getAnnotationContentByUserListTarget: GetAnnotationContentByUserListTarget = (articleId, listOwnerId) => () => {
  if (listOwnerId !== '1412019815619911685') {
    return undefined;
  }
  let content: string | undefined;
  if (articleId.value === '10.1101/2022.03.29.486216') {
    content = 'A 2.2 angstrom resolution structures of muscle actin filaments in ATP, ADP-Pi and ADP states. Many new insights here about the surprising stability of ADP actin, mechanism of ATP hydrolysis, cofilin binding and more.';
  }
  if (articleId.value === '10.1101/2021.05.26.445751') {
    content = 'Truly exquisite characterization of kinesins in the malaria parasite. Check out the spectacular expansion microscopy images in figure 7A!';
  }
  if (articleId.value === '10.1101/2022.03.31.486578') {
    content = 'This is a beautiful characterization of caveolae. In addition to platinum replica EM of these plasma membrane invaginations in various cell types, this work includes molecular identification of proteins associated with caveolae of different curvatures by STED-CLEM (very high-resolution correlative light electron microscopy).';
  }
  if (articleId.value === '10.1101/2022.03.31.486371') {
    content = 'Whoa! Successful ID of early endosomal cargoes via pull-down of an early endosomal marker followed by proteomics.';
  }
  return content;
};

export const savedArticles: SavedArticles = (ports) => (dois, loggedInUser, listOwnerId) => pipe(
  dois,
  RNEA.fromReadonlyArray,
  TE.fromOption(() => noSavedArticles),
  TE.chainW(flow(
    T.traverseArray(ports.fetchArticle),
    T.map(RA.rights),
    T.map(RA.match(
      () => E.left(informationUnavailable),
      (values) => E.right(values),
    )),
  )),
  TE.map(RA.map((article) => ({
    ...article,
    articleId: article.doi,
  }))),
  TE.chain(flow(
    TE.traverseArray(populateArticleViewModel({
      ...ports,
      getLatestArticleVersionDate: getLatestArticleVersionDate(ports.findVersionsForArticleDoi),
    })),
    TE.mapLeft(() => informationUnavailable),
  )),
  TE.chainTaskK(T.traverseArray((articleViewModel) => pipe(
    {
      articleViewModel: T.of(articleViewModel),
      controls: T.of(getArticleCardControls(loggedInUser, listOwnerId, articleViewModel.articleId)),
      annotationContent: pipe(
        ports.getAllEvents,
        T.map(getAnnotationContentByUserListTarget(articleViewModel.articleId, listOwnerId)),
      ),
    },
    sequenceS(T.ApplyPar),
  ))),
  TE.map(flow(
    RA.map(({ articleViewModel, controls, annotationContent }) => pipe(
      articleViewModel,
      renderArticleCard(controls, annotationContent),
    )),
    renderSavedArticles,
  )),
  TE.toUnion,
);
