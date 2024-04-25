import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import * as EL from '../../../../types/evaluation-locator';
import { RecordedEvaluation } from '../../../../types/recorded-evaluation';
import { sanitise } from '../../../../types/sanitised-html-fragment';
import { detectLanguage } from '../../shared-components/lang-attribute';
import { EvaluationPublishedFeedItem } from '../view-model';

export const toEvaluationPublishedFeedItem = (dependencies: Dependencies) => (
  evaluation: RecordedEvaluation,
): T.Task<EvaluationPublishedFeedItem> => pipe(
  {
    groupDetails: pipe(
      dependencies.getGroup(evaluation.groupId),
      O.match(
        () => ({
          groupName: 'A group',
          groupHref: `/groups/${evaluation.groupId}`,
          groupAvatarSrc: '/static/images/sciety-logo.jpg',
        }),
        (group) => ({
          groupName: group.name,
          groupHref: `/groups/${group.slug}`,
          groupAvatarSrc: group.avatarPath,
        }),
      ),
      T.of,
    ),
    review: pipe(
      evaluation.evaluationLocator,
      dependencies.fetchEvaluation,
      TE.match(
        () => ({
          url: EL.inferredSourceUrl(evaluation.evaluationLocator),
          fullText: O.none,
          fullTextLanguageCode: O.none,
        }),
        (review) => ({
          ...review,
          url: O.some(review.url),
          fullText: O.some(review.fullText),
          fullTextLanguageCode: detectLanguage(review.fullText),
        }),
      ),
    ),
  },
  sequenceS(T.ApplyPar),
  T.map(({
    groupDetails, review,
  }) => ({
    type: 'evaluation-published' as const,
    id: evaluation.evaluationLocator,
    sourceHref: review.url,
    publishedAt: evaluation.publishedAt,
    ...groupDetails,
    fullText: O.map(sanitise)(review.fullText),
    fullTextLanguageCode: review.fullTextLanguageCode,
  })),
);
