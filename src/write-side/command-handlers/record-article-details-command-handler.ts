import { pipe, flow } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import { RecordArticleDetailsCommand } from '../commands';
import { CommandHandler } from '../../types/command-handler';
import { CommitEvents, FetchArticle, GetAllEvents } from '../../shared-ports';
import { DomainEvent, constructEvent, isEventOfType } from '../../domain-events';
import { toErrorMessage } from '../../types/error-message';

const ONE_DAY = 24 * 60 * 60 * 1000;

type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
  fetchArticle: FetchArticle,
};

type RecordArticleDetailsCommandHandler = (
  adapters: Ports
) => CommandHandler<RecordArticleDetailsCommand>;

export type RecordArticleDetails = ReturnType<RecordArticleDetailsCommandHandler>;

export const recordArticleDetailsCommandHandler: RecordArticleDetailsCommandHandler = (
  adapters,
) => (command) => pipe(
  adapters.getAllEvents,
  TE.rightTask,
  TE.map(RA.filter(isEventOfType('ArticleDetailsRecorded'))),
  TE.map(RA.filter((event) => event.doi.value === command.articleId.value)),
  TE.chainW(flow(
    RA.last,
    O.filter((event) => (new Date().getHours() - event.date.getHours()) < ONE_DAY),
    O.matchW(
      () => pipe(
        command.articleId,
        adapters.fetchArticle,
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
        TE.map((newEvent) => [newEvent]),
      ),
      () => TE.right([] as ReadonlyArray<DomainEvent>),
    ),
  )),
  TE.chainTaskK(adapters.commitEvents),
);
