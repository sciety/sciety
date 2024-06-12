import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { RecordedEvaluation } from '../../../../types/recorded-evaluation';
import { sanitise } from '../../../../types/sanitised-html-fragment';
import { constructGroupPagePath } from '../../../paths';
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
          groupHref: O.none,
          groupAvatarSrc: '/static/images/sciety-logo.jpg',
        }),
        (group) => ({
          groupName: group.name,
          groupHref: O.some(constructGroupPagePath.home.href(group)),
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
    evaluationDigest: pipe(
      evaluation.evaluationLocator,
      dependencies.fetchEvaluationDigest,
      TE.match(
        () => ({
          digest: O.none,
          digestLanguageCode: O.none,
        }),
        (digest) => ({
          digest: O.some(digest),
          digestLanguageCode: detectLanguage(digest),
        }),
      ),
    ),
  },
  sequenceS(T.ApplyPar),
  T.map(({
    groupDetails, evaluationDigest, sourceHref,
  }) => ({
    type: 'evaluation-published' as const,
    id: evaluation.evaluationLocator,
    sourceHref,
    publishedAt: evaluation.publishedAt,
    ...groupDetails,
    digest: O.map(sanitise)(evaluationDigest.digest),
    digestLanguageCode: evaluationDigest.digestLanguageCode,
  })),
);
