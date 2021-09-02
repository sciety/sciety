import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as PR from 'io-ts/PathReporter';
import { Evaluation } from './evaluations';
import { FetchData } from './fetch-data';
import * as Hyp from './hypothesis';
import { daysAgo } from './time';
import { FetchEvaluations, SkippedItem } from './update-all';

// TODO bioRxiv/medRxiv content is available at multiple URL patterns:
// curl "https://api.hypothes.is/api/search?uri.parts=biorxiv&limit=100" | jq --raw-output ".rows[].target[].source"

const toEvaluation = (row: Hyp.Annotation): E.Either<SkippedItem, Evaluation> => {
  const doiRegex = '(10\\.[0-9]{4,}(?:\\.[1-9][0-9]*)*/(?:[^%"#?\\s])+)';
  // eslint-disable-next-line no-useless-escape
  const matches = new RegExp(`https://www.(bio|med)rxiv.org/content/${doiRegex}v[0-9]+\.*$`).exec(row.uri);
  if (matches === null) {
    return E.left({ item: row.uri, reason: 'Cannot parse into a biorxiv DOI' });
  }
  const doi = matches[2];
  return E.right({
    date: new Date(row.created),
    articleDoi: doi,
    evaluationLocator: `hypothesis:${row.id}`,
  });
};

const latestDateOf = (items: ReadonlyArray<Hyp.Annotation>) => (
  encodeURIComponent(items[items.length - 1].created)
);

const fetchPaginatedData = (
  fetchData: FetchData,
  baseUrl: string,
  offset: string,
): TE.TaskEither<string, ReadonlyArray<Hyp.Annotation>> => pipe(
  fetchData<unknown>(`${baseUrl}${offset}`),
  TE.chainEitherK(flow(
    Hyp.responseFromJson.decode,
    E.mapLeft((error) => PR.failure(error).join('\n')),
  )),
  TE.map((response) => response.rows),
  TE.chain(RA.match(
    () => TE.right([]),
    (items) => pipe(
      fetchPaginatedData(fetchData, baseUrl, latestDateOf(items)),
      TE.map((next) => [...items, ...next]),
    ),
  )),
);

// ts-unused-exports:disable-next-line
export const processServer = (
  owner: string,
  startDate: Date,
  fetchData: FetchData,
) => (server: string): TE.TaskEither<string, ReadonlyArray<Hyp.Annotation>> => {
  const latestDate = encodeURIComponent(startDate.toISOString());
  const baseUrl = `https://api.hypothes.is/api/search?${owner}&uri.parts=${server}&limit=200&sort=created&order=asc&search_after=`;
  return fetchPaginatedData(fetchData, baseUrl, latestDate);
};

const fetchEvaluationsByGroupSince = (
  startDate: Date,
  fetchData: FetchData,
) => (groupId: string): TE.TaskEither<string, ReadonlyArray<Hyp.Annotation>> => pipe(
  ['biorxiv', 'medrxiv'],
  TE.traverseArray(processServer(`group=${groupId}`, startDate, fetchData)),
  TE.map(RA.flatten),
);

type Ports = {
  fetchData: FetchData,
};

export const fetchReviewsFromHypothesisGroup = (publisherGroupId: string): FetchEvaluations => (ports: Ports) => pipe(
  publisherGroupId,
  fetchEvaluationsByGroupSince(daysAgo(5), ports.fetchData),
  TE.map(RA.map(toEvaluation)),
  TE.map((parts) => ({
    evaluations: RA.rights(parts),
    skippedItems: RA.lefts(parts),
  })),
);
