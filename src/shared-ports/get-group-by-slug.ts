import * as E from 'fp-ts/Either';
import * as DE from '../types/data-error';
import { Group } from '../types/group';

export type GetGroupBySlug = (slug: string) => E.Either<DE.DataError, Group>;
