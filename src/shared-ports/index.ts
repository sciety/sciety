import { AddArticleToList } from './add-article-to-list';
import { CommitEvents } from './commit-events';
import { CreateList } from './create-list';
import { GetAllEvents } from './get-all-events';
import { RecordSubjectArea } from './record-subject-area';
import { Logger } from '../logger';
import { ExternalQueries } from '../third-parties';

export { GetAllEvents } from './get-all-events';
export { CommitEvents } from './commit-events';
export {
  Logger,
} from '../logger';
export { LogLevel, defaultLogLevel, shouldBeLogged } from './log-level';
export { AddArticleToList } from './add-article-to-list';
export { CreateList } from './create-list';
export { RecordSubjectArea } from './record-subject-area';

export type SharedPorts = ExternalQueries & {
  addArticleToList: AddArticleToList,
  commitEvents: CommitEvents,
  createList: CreateList,
  getAllEvents: GetAllEvents,
  logger: Logger,
  recordSubjectArea: RecordSubjectArea,
};
