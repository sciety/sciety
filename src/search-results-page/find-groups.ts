import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { constant, flow, pipe } from 'fp-ts/function';
import { Group } from '../types/group';
import { GroupId } from '../types/group-id';

export type FetchStaticFile = (filename: string) => TE.TaskEither<'not-found' | 'unavailable', string>;

type SearchableGroupFields = Group & { description: string };

const normalize = (string: string) => string.toLowerCase();

const normalizedIncludes = (searchable: string, query: string) => pipe(
  searchable,
  normalize,
  (normalized) => normalized.includes(query),
);

const includesQuery = (query: string) => (group: SearchableGroupFields) => pipe(
  query,
  normalize,
  (normalizedQuery) => (
    normalizedIncludes(group.name, normalizedQuery)
    || normalizedIncludes(group.shortDescription, normalizedQuery)
    || normalizedIncludes(group.description, normalizedQuery)
  ),
);

type FindGroups = (
  fetchStaticFile: FetchStaticFile,
  groups: RNEA.ReadonlyNonEmptyArray<Group>
) => (query: string) => T.Task<ReadonlyArray<GroupId>>;
export const findGroups: FindGroups = (fetchStaticFile, groups) => (query) => pipe(
  groups,
  T.traverseArray((group) => pipe(
    `groups/${group.descriptionPath}`,
    fetchStaticFile,
    T.map(E.getOrElse(constant(''))),
    T.map((description) => ({
      ...group,
      description,
    })),
  )),
  T.map(flow(
    RA.filter(includesQuery(query)),
    RA.map((group) => group.id),
  )),
);
