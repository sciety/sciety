import axios from 'axios';
import * as E from 'fp-ts/Either';
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

const toEvaluation = (row: Row): E.Either<SkippedItem, Evaluation> => {
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

const processServer = (publisherGroupId: string) => (server: string) => async () => {
  const result: Array<Row> = [];
  const perPage = 200;
  let data;
  let offset = 0;
  const baseUrl = `https://api.hypothes.is/api/search?group=${publisherGroupId}&uri.parts=${server}&limit=${perPage}&offset=`;
  // eslint-disable-next-line no-loops/no-loops
  do {
    data = (await axios.get<HypothesisResponse>(`${baseUrl}${offset}`)).data;
    if (data.rows.length === 0) {
      return result;
    }
    result.concat(data.rows);
    offset += 200;
  } while (data.rows.length > 0);
  return result;
};

export const fetchReviewsFromHypothesisGroup = (publisherGroupId: string): FetchEvaluations => () => pipe(
  ['biorxiv', 'medrxiv'],
  T.traverseArray(processServer(publisherGroupId)),
  T.map(RA.flatten),
  T.map(RA.map(toEvaluation)),
  T.map((parts) => ({
    evaluations: RA.rights(parts),
    skippedItems: RA.lefts(parts),
  })),
  TE.rightTask,
);
