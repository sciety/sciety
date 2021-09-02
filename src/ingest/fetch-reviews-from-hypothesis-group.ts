import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Evaluation } from './evaluations';
import { FetchData } from './fetch-data';
import * as Hyp from './hypothesis';
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

const fetchPaginatedData = (
  getData: FetchData,
  baseUrl: string,
  offset: number,
): TE.TaskEither<string, ReadonlyArray<Hyp.Annotation>> => pipe(
  getData<Hyp.Response>(`${baseUrl}${offset}`),
  TE.map((response) => response.rows),
  TE.chain(RA.match(
    () => TE.right([]),
    (items) => pipe(
      fetchPaginatedData(getData, baseUrl, offset + items.length),
      TE.map((next) => [...items, ...next]),
    ),
  )),
);

// ts-unused-exports:disable-next-line
export const processServer = (
  publisherGroupId: string,
  getData: FetchData,
) => (server: string): TE.TaskEither<string, ReadonlyArray<Hyp.Annotation>> => {
  const pageSize = 200;
  const baseUrl = `https://api.hypothes.is/api/search?group=${publisherGroupId}&uri.parts=${server}&limit=${pageSize}&offset=`;
  return fetchPaginatedData(getData, baseUrl, 0);
};

type Ports = {
  fetchData: FetchData,
};

export const fetchReviewsFromHypothesisGroup = (publisherGroupId: string): FetchEvaluations => (ports: Ports) => pipe(
  ['biorxiv', 'medrxiv'],
  TE.traverseArray(processServer(publisherGroupId, ports.fetchData)),
  TE.map(RA.flatten),
  TE.map(RA.map(toEvaluation)),
  TE.map((parts) => ({
    evaluations: RA.rights(parts),
    skippedItems: RA.lefts(parts),
  })),
);
