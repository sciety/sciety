import * as O from 'fp-ts/Option';
import { Group } from '../types/group';

export type GetGroupBySlug = (slug: string) => O.Option<Group>;
