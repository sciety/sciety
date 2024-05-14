import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
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
    sourceHref: pipe(
      evaluation.evaluationLocator,
      dependencies.fetchEvaluationHumanReadableOriginalUrl,
      T.map(O.fromEither),
    ),
    review: pipe(
      evaluation.evaluationLocator,
      dependencies.fetchEvaluationDigest,
      TE.map(({ fullText }) => fullText),
      TE.match(
        () => ({
          fullText: O.none,
          fullTextLanguageCode: O.none,
        }),
        (digest) => ({
          fullText: O.some(digest),
          fullTextLanguageCode: detectLanguage(digest),
        }),
      ),
    ),
  },
  sequenceS(T.ApplyPar),
  T.map(({
    groupDetails, review, sourceHref,
  }) => ({
    type: 'evaluation-published' as const,
    id: evaluation.evaluationLocator,
    sourceHref,
    publishedAt: evaluation.publishedAt,
    ...groupDetails,
    fullText: O.map(sanitise)(review.fullText),
    fullTextLanguageCode: review.fullTextLanguageCode,
  })),
);
