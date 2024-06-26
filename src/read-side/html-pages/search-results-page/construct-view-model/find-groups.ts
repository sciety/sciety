import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { constant, flow, pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { Group } from '../../../../types/group';
import { GroupId } from '../../../../types/group-id';

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

type FindGroups = (dependencies: Dependencies, query: string)
=> T.Task<ReadonlyArray<GroupId>>;

export const findGroups: FindGroups = (dependencies, query) => pipe(
  dependencies.getAllGroups(),
  T.traverseArray((group) => pipe(
    `groups/${group.descriptionPath}`,
    dependencies.fetchStaticFile,
    T.map(flow(
      E.getOrElse(constant('')),
      (description) => ({
        ...group,
        description,
      }),
    )),
  )),
  T.map(flow(
    RA.filter(includesQuery(query)),
    RA.map((group) => group.id),
  )),
);
