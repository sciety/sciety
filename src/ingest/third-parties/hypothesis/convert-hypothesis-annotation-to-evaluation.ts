import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { Annotation } from './annotation';
import { supportedArticleIdFromLink } from '../../supported-article-id-from-link';
import { PublishedEvaluation, constructPublishedEvaluation } from '../../types/published-evaluation';
import { SkippedItem } from '../../types/skipped-item';

const annotationContainsText = (annotation: Annotation) => annotation.text.length > 0;

const mapTagToType = (
  tags: ReadonlyArray<string>,
  tagToEvaluationTypeMap: Record<string, ReadonlyArray<string>>,
): string => pipe(
  tagToEvaluationTypeMap,
  R.filter((t) => pipe(
    tags,
    RA.some((tag) => t.includes(tag)),
  )),
  R.keys,
  (keys) => (keys.length === 1 ? keys[0] : 'not-provided'),
);

export const convertHypothesisAnnotationToEvaluation = (
  tagToEvaluationTypeMap: Record<string, ReadonlyArray<string>>,
) => (
  annotation: Annotation,
): E.Either<SkippedItem, PublishedEvaluation> => pipe(
  annotation.uri,
  supportedArticleIdFromLink,
  E.filterOrElse(
    () => annotationContainsText(annotation),
    () => 'annotation text field is empty',
  ),
  E.bimap(
    (reason) => ({ item: annotation.uri, reason }),
    (articleDoi) => constructPublishedEvaluation({
      publishedOn: new Date(annotation.created),
      paperExpressionDoi: articleDoi,
      evaluationLocator: `hypothesis:${annotation.id}`,
      evaluationType: mapTagToType(
        annotation.tags,
        tagToEvaluationTypeMap,
      ),
    }),
  ),
);
