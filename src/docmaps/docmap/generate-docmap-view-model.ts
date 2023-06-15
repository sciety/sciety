import { URL } from 'url';
import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { Evaluation } from './evaluation';
import { Ports as GetDateOfMostRecentArticleVersionPorts, getPublishedDateOfMostRecentArticleVersion } from './get-published-date-of-most-recent-article-version';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';
import { Group } from '../../types/group';
import { GroupId } from '../../types/group-id';
import { inferredSourceUrl, EvaluationLocator } from '../../types/evaluation-locator';
import { Queries } from '../../shared-read-models';
import { updateWithF } from '../../updateWith';

export type DocmapModel = {
  articleId: Doi,
  group: Group,
  inputPublishedDate: O.Option<Date>,
  evaluations: RNEA.ReadonlyNonEmptyArray<Evaluation>,
};

type DocmapIdentifier = {
  articleId: Doi,
  groupId: GroupId,
};

type GenerateDocmapViewModel = (
  adapters: Ports
) => (
  docmapIdentifier: DocmapIdentifier
) => TE.TaskEither<DE.DataError, DocmapModel>;

export type Ports = Queries & GetDateOfMostRecentArticleVersionPorts & {
  fetchReview: (reviewId: EvaluationLocator) => TE.TaskEither<DE.DataError, { url: URL }>,
};

const getSourceUrl = (adapters: Ports) => (input: { reviewId: EvaluationLocator }) => pipe(
  input.reviewId,
  inferredSourceUrl,
  O.fold(
    () => pipe(
      input.reviewId,
      adapters.fetchReview,
      TE.map((fetchedReview) => ({
        sourceUrl: fetchedReview.url,
      })),
    ),
    (sourceUrl) => TE.right({
      sourceUrl,
    }),
  ),
);

export const generateDocmapViewModel: GenerateDocmapViewModel = (adapters) => ({ articleId, groupId }) => pipe(
  {
    articleId: TE.right(articleId),
    evaluations: pipe(
      adapters.getEvaluationsForDoi(articleId),
      TE.right,
      TE.map(RA.filter((ev) => ev.groupId === groupId)),
      TE.chain(TE.traverseArray(updateWithF(TE.ApplyPar)(getSourceUrl(adapters)))),
      TE.chainEitherKW(flow(
        RNEA.fromReadonlyArray,
        E.fromOption(() => DE.notFound),
      )),
    ),
    inputPublishedDate: getPublishedDateOfMostRecentArticleVersion(adapters, articleId),
    group: pipe(
      adapters.getGroup(groupId),
      TE.fromOption(() => DE.notFound),
    ),
  },
  sequenceS(TE.ApplyPar),
);
