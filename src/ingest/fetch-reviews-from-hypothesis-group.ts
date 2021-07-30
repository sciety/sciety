import axios from 'axios';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Evaluation } from './evaluations';
import { FetchEvaluations, SkippedItem } from './update-all';

type Row = {
  id: string,
  created: string,
  uri: string,
};

type HypothesisResponse = {
  total: number,
  rows: Array<Row>,
};

// TODO bioRxiv/medRxiv content is available at multiple URL patterns:
// curl "https://api.hypothes.is/api/search?uri.parts=biorxiv&limit=100" | jq --raw-output ".rows[].target[].source"

const toEvaluation = (server: string) => (row: Row): E.Either<SkippedItem, Evaluation> => {
  const doiRegex = '(10\\.[0-9]{4,}(?:\\.[1-9][0-9]*)*/(?:[^%"#?\\s])+)';
  // eslint-disable-next-line no-useless-escape
  const matches = new RegExp(`https://www.${server}.org/content/${doiRegex}v[0-9]+\.*$`).exec(row.uri);
  if (matches === null) {
    return E.left({ item: row.uri, reason: 'Cannot parse into a biorxiv DOI' });
  }
  const doi = matches[1];
  return E.right({
    date: new Date(row.created),
    articleDoi: doi,
    evaluationLocator: `hypothesis:${row.id}`,
  });
};

const processServer = (
  publisherGroupId: string,
) => (server: string) => async (): Promise<ReadonlyArray<E.Either<SkippedItem, Evaluation>>> => {
  let result: ReadonlyArray<E.Either<SkippedItem, Evaluation>> = [];
  const perPage = 200;
  let data;
  let pageNumber = 0;
  // eslint-disable-next-line no-loops/no-loops
  do {
    data = (await axios.get<HypothesisResponse>(`https://api.hypothes.is/api/search?group=${publisherGroupId}&uri.parts=${server}&limit=${perPage}&offset=${perPage * pageNumber}`)).data;
    const evaluations = pipe(
      data.rows,
      RA.map(toEvaluation(server)),
    );
    result = [...result, ...evaluations];
    pageNumber += 1;
  } while (data.rows.length > 0);
  return result;
};

export const fetchReviewsFromHypothesisGroup = (publisherGroupId: string): FetchEvaluations => () => pipe(
  ['biorxiv', 'medrxiv'],
  T.traverseArray(processServer(publisherGroupId)),
  T.map(RA.flatten),
  T.map((parts) => ({
    evaluations: RA.rights(parts),
    skippedItems: O.some(RA.lefts(parts)),
  })),
  TE.rightTask,
);
