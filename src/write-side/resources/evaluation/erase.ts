import * as E from 'fp-ts/Either';
import { incorrectlyRecordedEvaluationErased } from '../../../domain-events/incorrectly-recorded-evaluation-erased-event';
import { DomainEvent } from '../../../domain-events';
import { EraseEvaluationCommand } from '../../commands';
import { ErrorMessage } from '../../../types/error-message';

type Erase = (command: EraseEvaluationCommand)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<ErrorMessage, ReadonlyArray<DomainEvent>>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const erase: Erase = (command) => (events) => E.right([
  incorrectlyRecordedEvaluationErased(command.evaluationLocator),
]);
