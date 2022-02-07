import * as T from 'fp-ts/Task';
import { Ports as AddArticleToListPorts } from '../add-article-to-list';
import { DomainEvent, isEvaluationRecordedEvent } from '../domain-events';
import { Logger } from '../infrastructure/logger';

export type Ports = AddArticleToListPorts & {
  logger: Logger,
};

type AddArticleToElifeMedicineList = (ports: Ports) => (event: DomainEvent) => T.Task<void>;

export const addArticleToElifeMedicineList: AddArticleToElifeMedicineList = () => (event) => {
  if (!isEvaluationRecordedEvent(event)) {
    return T.of(undefined);
  }
  return T.of(undefined);
};
