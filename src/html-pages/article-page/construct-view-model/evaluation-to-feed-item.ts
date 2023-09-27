import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { sequenceS } from 'fp-ts/Apply';
import * as EL from '../../../types/evaluation-locator';
import { sanitise } from '../../../types/sanitised-html-fragment';
import { GroupId } from '../../../types/group-id';
import { EvaluationLocator } from '../../../types/evaluation-locator';
import { EvaluationFeedItem } from '../view-model';
import { detectLanguage } from '../../../shared-components/lang-attribute';
import { Dependencies } from './dependencies';

export type EvaluationEvent = {
  type: 'evaluation',
  groupId: GroupId,
  evaluationLocator: EvaluationLocator,
  publishedAt: Date,
};

export const evaluationToFeedItem = (
  dependencies: Dependencies,
  feedEvent: EvaluationEvent,
): T.Task<EvaluationFeedItem> => pipe(
  {
    groupDetails: pipe(
      dependencies.getGroup(feedEvent.groupId),
      O.match(
        () => ({
          groupName: 'A group',
          groupHref: `/groups/${feedEvent.groupId}`,
          groupAvatar: '/static/images/sciety-logo.jpg',
        }),
        (group) => ({
          groupName: group.name,
          groupHref: `/groups/${group.slug}`,
          groupAvatar: group.avatarPath,
        }),
      ),
      T.of,
    ),
    review: pipe(
      feedEvent.evaluationLocator,
      dependencies.fetchReview,
      TE.match(
        () => ({
          url: EL.inferredSourceUrl(feedEvent.evaluationLocator),
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
    type: 'evaluation' as const,
    id: feedEvent.evaluationLocator,
    sourceHref: review.url,
    publishedAt: feedEvent.publishedAt,
    ...groupDetails,
    fullText: O.map(sanitise)(review.fullText),
    fullTextLanguageCode: review.fullTextLanguageCode,
  })),
);
