import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { RecordedEvaluation } from '../../../../read-models/evaluations';
import { constructGroupPagePath } from '../../../../standards/paths';
import { GroupId } from '../../../../types/group-id';
import { sanitise } from '../../../../types/sanitised-html-fragment';
import { detectLanguage } from '../../shared-components/lang-attribute';
import { EvaluationPublishedFeedItem } from '../view-model';

const constructGroupDetails = (dependencies: Dependencies, groupId: GroupId) => pipe(
  groupId,
  dependencies.getGroup,
  O.map((group) => ({
    name: group.name,
    href: constructGroupPagePath.home.href(group),
    avatarSrc: group.avatarPath,
  })),
);

export const toEvaluationPublishedFeedItem = (dependencies: Dependencies) => (
  evaluation: RecordedEvaluation,
): T.Task<EvaluationPublishedFeedItem> => pipe(
  {
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
  T.map(({ evaluationDigest, sourceHref }) => ({
    type: 'evaluation-published' as const,
    id: evaluation.evaluationLocator,
    sourceHref,
    publishedAt: evaluation.publishedAt,
    groupDetails: constructGroupDetails(dependencies, evaluation.groupId),
    digest: O.map(sanitise)(evaluationDigest.digest),
    digestLanguageCode: evaluationDigest.digestLanguageCode,
  })),
);
