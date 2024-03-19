import { AddArticleToList } from './add-article-to-list';
import { CommitEvents } from './commit-events';
import { CreateList } from './create-list';
import { EditListDetails } from './edit-list-details';
import { GetAllEvents } from './get-all-events';
import { Logger } from './logger';
import { RecordSubjectArea } from './record-subject-area';
import { ExternalQueries } from '../third-parties';

export { GetAllEvents } from './get-all-events';
export { CommitEvents } from './commit-events';
export { EditListDetails } from './edit-list-details';
export {
  Logger,
} from './logger';
export { LogLevel, defaultLogLevel, shouldBeLogged } from './log-level';
export { AddArticleToList } from './add-article-to-list';
export { CreateList } from './create-list';
export { RecordSubjectArea } from './record-subject-area';

export type SharedPorts = ExternalQueries & {
  addArticleToList: AddArticleToList,
  commitEvents: CommitEvents,
  createList: CreateList,
  editListDetails: EditListDetails,
  getAllEvents: GetAllEvents,
  logger: Logger,
  recordSubjectArea: RecordSubjectArea,
};
