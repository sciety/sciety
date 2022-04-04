import { EventId } from '../types/event-id';

type AnnotationContent = unknown;
type AnnotationTarget = unknown;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type AnnotationCreatedEvent = {
  type: 'AnnotationCreated',
  date: Date,
  id: EventId,
  content: AnnotationContent,
  target: AnnotationTarget,
};
