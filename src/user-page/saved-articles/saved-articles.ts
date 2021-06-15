import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow } from 'fp-ts/function';
import { FetchArticle, fetchSavedArticles } from './fetch-saved-articles';
import { GetAllEvents, projectSavedArticleDois } from './project-saved-article-dois';
import { renderSavedArticles } from './render-saved-articles';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { UserId } from '../../types/user-id';

export type Ports = {
  getAllEvents: GetAllEvents,
  fetchArticle: FetchArticle,
};

const renderUnavailable = () => toHtmlFragment('<p>We couldn\'t find this information; please try again later.</p>');

type SavedArticles = (ports: Ports) => (u: UserId) => TE.TaskEither<never, HtmlFragment>;

export const savedArticles: SavedArticles = (ports) => flow(
  projectSavedArticleDois(ports.getAllEvents),
  T.chain(fetchSavedArticles(ports.fetchArticle)),
  T.map(E.fold(renderUnavailable, renderSavedArticles)),
  TE.rightTask,
);
