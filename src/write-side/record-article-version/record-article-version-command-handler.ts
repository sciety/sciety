import * as T from 'fp-ts/Task';
import * as B from 'fp-ts/boolean';
import * as TE from 'fp-ts/TaskEither';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { isArticleVersionRecordedEvent, articleVersionRecorded } from '../../domain-events/article-version-recorded-event';
import { RecordArticleVersionCommand } from '../commands';
import { CommitEvents, GetAllEvents } from '../../shared-ports';
import { CommandHandler } from '../../types/command-handler';
import { eqDoi } from '../../types/doi';

export type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

type RecordArticleVersionCommandHandler = (
  adapters: Ports
) => CommandHandler<RecordArticleVersionCommand>;

export const recordArticleVersionCommandHandler: RecordArticleVersionCommandHandler = (
  adapters,
) => (
  command,
) => pipe(
  adapters.getAllEvents,
  T.map(RA.filter(isArticleVersionRecordedEvent)),
  T.map(RA.some((event) => eqDoi.equals(event.articleId, command.articleId) && event.version === command.version)),
  T.map(B.match(
    () => [articleVersionRecorded(
      command.articleId,
      command.version,
      command.publishedAt,
    )],
    () => [],
  )),
  T.chain(adapters.commitEvents),
  TE.rightTask,
);
