import * as TE from 'fp-ts/TaskEither';
import { Adapters } from '../infrastructure';
import { CommandResult } from '../types/command-result';

type CreateAnnotation = (adapters: Adapters) => (input: unknown) => TE.TaskEither<string, CommandResult>;

export const createAnnotation: CreateAnnotation = () => () => TE.left('');
