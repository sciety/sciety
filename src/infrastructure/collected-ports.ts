import { Logger } from '../logger';
import { Queries } from '../read-models';
import { AddArticleToList } from '../shared-ports/add-article-to-list';
import { CommitEvents } from '../shared-ports/commit-events';
import { CreateList } from '../shared-ports/create-list';
import { GetAllEvents } from '../shared-ports/get-all-events';
import { RecordSubjectArea } from '../shared-ports/record-subject-area';
import { ExternalQueries } from '../third-parties';

export type CollectedPorts = Queries & ExternalQueries & {
  addArticleToList: AddArticleToList,
  commitEvents: CommitEvents,
  createList: CreateList,
  getAllEvents: GetAllEvents,
  logger: Logger,
  recordSubjectArea: RecordSubjectArea,
};
