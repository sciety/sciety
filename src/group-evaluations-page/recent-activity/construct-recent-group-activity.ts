import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { constant, flow, pipe } from 'fp-ts/function';
import { groupActivities } from './group-activities';
import { renderRecentGroupActivity } from './render-recent-group-activity';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';
import { DomainEvent } from '../../types/domain-events';
import { GroupId } from '../../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

type GetArticleDetails = (doi: Doi) => T.Task<O.Option<{
  title: SanitisedHtmlFragment,
  authors: ReadonlyArray<string>,
  latestVersionDate: O.Option<Date>,
}>>;

const noActivity = pipe(
  '<p>It looks like this group hasn’t evaluated any articles yet. Try coming back later!</p>',
  toHtmlFragment,
  constant,
);

const addArticleDetails = (
  getArticleDetails: GetArticleDetails,
) => <A extends { doi: Doi }>(evaluatedArticle: A) => pipe(
  evaluatedArticle.doi,
  getArticleDetails,
  TO.map((articleDetails) => ({
    ...evaluatedArticle,
    ...articleDetails,
  })),
);

export const constructRecentGroupActivity = (
  getArticleDetails: GetArticleDetails,
  getAllEvents: GetAllEvents,
) => (groupId: GroupId, pageNumber: number): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  getAllEvents,
  T.map(groupActivities(groupId, pageNumber, 20)),
  TE.chainW(({ content, nextPageNumber }) => pipe(
    content,
    TO.traverseArray(addArticleDetails(getArticleDetails)),
    T.map(E.fromOption(() => DE.unavailable)),
    TE.map(RNEA.fromReadonlyArray),
    TE.map(O.fold(
      noActivity,
      flow(
        RNEA.map((articleViewModel) => ({
          ...articleViewModel,
          latestVersionDate: articleViewModel.latestVersionDate,
          latestActivityDate: O.some(articleViewModel.latestActivityDate),
        })),
        renderRecentGroupActivity(pipe(
          nextPageNumber,
          O.map((p) => `/groups/${groupId}/recently-evaluated?page=${p}`),
        )),
      ),
    )),
  )),
);
