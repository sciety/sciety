import * as E from 'fp-ts/Either';
import { Command } from './execute-command';
import * as GID from '../types/group-id';

type ValidateInputShape = (input: unknown) => E.Either<unknown, Command>;

export const validateInputShape: ValidateInputShape = () => E.right({
  groupId: GID.fromValidatedString(''),
});
