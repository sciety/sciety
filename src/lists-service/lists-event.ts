import { EvaluationRecordedEvent, ListCreatedEvent } from '../domain-events';

export type ListsEvent = ListCreatedEvent | EvaluationRecordedEvent;
