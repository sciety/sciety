import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import { RecordArticleDetailsCommand } from '../commands';
import { CommandHandler } from '../../types/command-handler';
import { CommitEvents, FetchArticle, GetAllEvents } from '../../shared-ports';
import {
  DomainEvent, EventOfType, constructEvent, isEventOfType,
} from '../../domain-events';
import { ErrorMessage, toErrorMessage } from '../../types/error-message';
import { Doi } from '../../types/doi';

type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
  fetchArticle: FetchArticle,
};

const ONE_DAY = 24 * 60 * 60 * 1000;

const getDetailsYoungerThanOneDay = (articleId: Doi) => (
  events: ReadonlyArray<DomainEvent>,
): O.Option<EventOfType<'ArticleDetailsRecorded'>> => pipe(
  events,
  RA.filter(isEventOfType('ArticleDetailsRecorded')),
  RA.filter((event) => event.doi.value === articleId.value),
  RA.last,
  O.filter((event) => (new Date().getHours() - event.date.getHours()) < ONE_DAY),
);

const prepareNewEvent = (fetchArticle: Ports['fetchArticle']) => (articleId: Doi): TE.TaskEither<ErrorMessage, EventOfType<'ArticleDetailsRecorded'>> => pipe(
  articleId,
  fetchArticle,
  TE.map((details) => ({
    doi: details.doi,
    title: details.title,
    abstract: details.abstract,
    server: details.server,
    authors: pipe(
      details.authors,
      O.getOrElseW(() => []),
      (authors) => [...authors],
    ),
  })),
  TE.bimap(
    toErrorMessage,
    constructEvent('ArticleDetailsRecorded'),
  ),
);

type RecordArticleDetailsCommandHandler = (
  adapters: Ports
) => CommandHandler<RecordArticleDetailsCommand>;

export type RecordArticleDetails = ReturnType<RecordArticleDetailsCommandHandler>;

export const recordArticleDetailsCommandHandler: RecordArticleDetailsCommandHandler = (
  adapters,
) => (command) => pipe(
  adapters.getAllEvents,
  TE.rightTask,
  TE.map(getDetailsYoungerThanOneDay(command.articleId)),
  TE.chainW(O.match(
    () => pipe(
      command.articleId,
      prepareNewEvent(adapters.fetchArticle),
      TE.map((newEvent) => [newEvent]),
    ),
    () => TE.right([] as ReadonlyArray<DomainEvent>),
  )),
  TE.chainTaskK(adapters.commitEvents),
);
