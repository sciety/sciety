import * as T from 'fp-ts/Task';
import { Ports as AddArticleToListPorts } from '../add-article-to-list';
import { DomainEvent, isEvaluationRecordedEvent } from '../domain-events';
import { Logger } from '../infrastructure/logger';
import * as Gid from '../types/group-id';

type Ports = AddArticleToListPorts & {
  logger: Logger,
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
