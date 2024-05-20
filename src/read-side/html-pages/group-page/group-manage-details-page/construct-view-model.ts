import * as E from 'fp-ts/Either';
import { Params } from './params';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const constructViewModel = (params: Params): E.Either<unknown, void> => E.right(undefined);
