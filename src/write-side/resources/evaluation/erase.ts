import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { incorrectlyRecordedEvaluationErased, DomainEvent, isEvaluationRecordedEvent } from '../../../domain-events';
import { EraseEvaluationCommand } from '../../commands';
import { ErrorMessage } from '../../../types/error-message';

type Erase = (command: EraseEvaluationCommand)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<ErrorMessage, ReadonlyArray<DomainEvent>>;

export const erase: Erase = (command) => (events) => pipe(
  events,
  RA.filter(isEvaluationRecordedEvent),
  RA.filter((event) => event.evaluationLocator === command.evaluationLocator),
  RA.map(() => incorrectlyRecordedEvaluationErased(command.evaluationLocator)),
  E.right,
);
