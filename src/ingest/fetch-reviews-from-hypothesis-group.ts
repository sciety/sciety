import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Evaluation } from './evaluations';
import { FetchData } from './fetch-data';
import { supportedArticleIdFromLink } from './supported-article-id-from-link';
import { daysAgo } from './time';
import { FetchEvaluations, SkippedItem } from './update-all';
import * as Hyp from '../third-parties/hypothesis';

const annotationContainsText = (annotation: Hyp.Annotation) => annotation.text.length > 0;

export const toEvaluation = (annotation: Hyp.Annotation): E.Either<SkippedItem, Evaluation> => pipe(
  annotation.uri,
  supportedArticleIdFromLink,
  E.filterOrElse(
    () => annotationContainsText(annotation),
    () => 'annotation text field is empty',
  ),
  E.bimap(
    (reason) => ({ item: annotation.uri, reason }),
    (articleDoi) => ({
      date: new Date(annotation.created),
      articleDoi,
      evaluationLocator: `hypothesis:${annotation.id}`,
      authors: [],
    }),
  ),
);

type Ports = {
  fetchData: FetchData,
};

export const fetchReviewsFromHypothesisGroup = (
  publisherGroupId: string,
  daysToLookBack: number | Date = 5,
): FetchEvaluations => (ports: Ports) => pipe(
  publisherGroupId,
  Hyp.fetchEvaluationsByGroupSince(
    daysToLookBack instanceof Date ? daysToLookBack : daysAgo(daysToLookBack),
    ports.fetchData,
  ),
  TE.map(RA.map(toEvaluation)),
  TE.map((parts) => ({
    evaluations: RA.rights(parts),
    skippedItems: RA.lefts(parts),
  })),
);
