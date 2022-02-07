import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { Ports as AddArticleToListPorts } from '../add-article-to-list';
import { DomainEvent, isEvaluationRecordedEvent } from '../domain-events';
import { Logger } from '../infrastructure/logger';
import * as DE from '../types/data-error';
import { Doi } from '../types/doi';
import * as Gid from '../types/group-id';

type FetchSubjectArea = (articleId: Doi) => TE.TaskEither<DE.DataError, string>;

export type Ports = AddArticleToListPorts & {
  logger: Logger,
  fetchSubjectArea: FetchSubjectArea,
};

const elifeGroupId = Gid.fromValidatedString('b560187e-f2fb-4ff9-a861-a204f3fc0fb0');

type AddArticleToElifeMedicineList = (ports: Ports) => (event: DomainEvent) => T.Task<void>;

export const addArticleToElifeMedicineList: AddArticleToElifeMedicineList = () => (event) => {
  if (!isEvaluationRecordedEvent(event)) {
    return T.of(undefined);
  }
  if (event.groupId !== elifeGroupId) {
    return T.of(undefined);
  }
  return T.of(undefined);
};
