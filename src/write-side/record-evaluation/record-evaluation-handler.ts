import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { recordEvaluationCommandCodec } from '../commands';
import { validateInputShape } from '../commands/validate-input-shape';
import { CommandResult } from '../../types/command-result';
import { Ports, recordEvaluationCommandHandler } from './record-evaluation-command-handler';

type RecordEvaluationHandler = (ports: Ports) => (input: unknown) => TE.TaskEither<string, CommandResult>;

export const recordEvaluationHandler: RecordEvaluationHandler = (ports) => (input) => pipe(
  input,
  validateInputShape(recordEvaluationCommandCodec),
  TE.fromEither,
  TE.chain(recordEvaluationCommandHandler(ports)),
);
