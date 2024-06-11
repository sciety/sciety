import { Logger } from '../logger';
import { Queries } from '../read-models';
import { AddArticleToList } from '../shared-ports/add-article-to-list';
import { CommitEvents } from '../shared-ports/commit-events';
import { CreateList } from '../shared-ports/create-list';
import { GetAllEvents } from '../shared-ports/get-all-events';
import { RecordSubjectArea } from '../shared-ports/record-subject-area';
import { ExternalQueries } from '../third-parties';

type EventStore = {
  commitEvents: CommitEvents,
  getAllEvents: GetAllEvents,
};

type CommandHandlersForSagas = {
  addArticleToList: AddArticleToList,
  createList: CreateList,
  recordSubjectArea: RecordSubjectArea,
};

export type CollectedPorts = Queries
& ExternalQueries
& EventStore
& CommandHandlersForSagas
& {
  logger: Logger,
};
