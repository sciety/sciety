import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Evaluation } from './evaluations';
import { FetchData } from './fetch-data';
import { daysAgo } from './time';
import { FetchEvaluations, SkippedItem } from './update-all';
import * as Hyp from '../third-parties/hypothesis';

// TODO bioRxiv/medRxiv content is available at multiple URL patterns:
// curl "https://api.hypothes.is/api/search?uri.parts=biorxiv&limit=100" | jq --raw-output ".rows[].target[].source"

const toEvaluation = (row: Hyp.Annotation): E.Either<SkippedItem, Evaluation> => {
  const shortRegex = '((?:[^%"#?\\s])+)';
  const matches = new RegExp(`https?://(?:www.)?(bio|med)rxiv.org/cgi/content/(?:10.1101|short)/${shortRegex}$`).exec(row.uri);
  if (matches === null) {
    return E.left({ item: row.uri, reason: 'Cannot parse into the biorxiv DOI' });
  }
  const doi = matches[2];
  return E.right({
    date: new Date(row.created),
    articleDoi: `10.1101/${doi}`,
    evaluationLocator: `hypothesis:${row.id}`,
    authors: [],
  });
};

type Ports = {
  fetchData: FetchData,
};

export const fetchReviewsFromHypothesisUser = (publisherUserId: string): FetchEvaluations => (ports: Ports) => pipe(
  publisherUserId,
  Hyp.fetchEvaluationsByUserSince(daysAgo(5), ports.fetchData),
  TE.map(RA.map(toEvaluation)),
  TE.map((parts) => ({
    evaluations: RA.rights(parts),
    skippedItems: RA.lefts(parts),
  })),
);
