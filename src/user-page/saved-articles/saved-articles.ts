import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow } from 'fp-ts/function';
import { Doi } from '../../types/doi';
import { HtmlFragment } from '../../types/html-fragment';
import { UserId } from '../../types/user-id';
import { fetchSavedArticles } from '../fetch-saved-articles';
import { GetAllEvents, projectSavedArticleDois } from '../project-saved-article-dois';
import { renderSavedArticles } from '../render-saved-articles';

type FetchArticle = (doi: Doi) => TE.TaskEither<unknown, { title: HtmlFragment }>;

const getTitle = (fetchArticle: FetchArticle) => flow(
  fetchArticle,
  T.map(flow(
    O.fromEither,
    O.map((article) => article.title),
  )),
);

export type Ports = {
  getAllEvents: GetAllEvents,
  fetchArticle: FetchArticle,
};

type SavedArticles = (ports: Ports) => (u: UserId) => TE.TaskEither<never, HtmlFragment>;

export const savedArticles: SavedArticles = (ports) => flow(
  projectSavedArticleDois(ports.getAllEvents),
  T.chain(fetchSavedArticles(getTitle(ports.fetchArticle))),
  T.map(renderSavedArticles),
  TE.rightTask,
);
