import { pipe } from 'fp-ts/function';
import { RecordEvaluationCommand } from '../commands';
import { Ports, recordEvaluationCommandHandler } from './record-evaluation-command-handler';
import { CommandHandler } from '../../types/command-handler';

type RecordEvaluationHandler = (
  adapters: Ports
) => CommandHandler<RecordEvaluationCommand>;

export const recordEvaluationHandler: RecordEvaluationHandler = (ports) => (command) => pipe(
  command,
  recordEvaluationCommandHandler(ports),
);
