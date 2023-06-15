import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as GID from '../../../types/group-id';
import { Doi } from '../../../types/doi';
import { detectLanguage } from '../../../shared-components/lang-attribute';
import { ViewModel } from '../view-model';
import { Dependencies } from './dependencies';
import { EvaluationLocator } from '../../../types/evaluation-locator';

type CurationStatement = {
  articleId: Doi,
  evaluationLocator: EvaluationLocator,
  groupId: GID.GroupId,
};

const addGroupInformation = (dependencies: Dependencies) => (statement: CurationStatement) => pipe(
  statement.groupId,
  dependencies.getGroup,
  E.fromOption(() => {
    dependencies.logger('error', 'Group not found in read model', { statement });
  }),
  E.map((group) => ({
    ...statement,
    groupName: group.name,
    groupSlug: group.slug,
    groupLogo: group.largeLogoPath,
  })),
);

type Partial = {
  groupName: string,
  groupSlug: string,
  groupLogo: O.Option<string>,
  evaluationLocator: EvaluationLocator,
  groupId: GID.GroupId,
};

const addEvaluationText = (dependencies: Dependencies) => (partial: Partial) => pipe(
  partial.evaluationLocator,
  dependencies.fetchReview,
  TE.map((review) => ({
    ...partial,
    statement: review.fullText,
    statementLanguageCode: detectLanguage(review.fullText),
  })),
);

type ConstructCurationStatements = (dependencies: Dependencies, doi: Doi) => T.Task<ViewModel['curationStatements']>;

export const constructCurationStatements: ConstructCurationStatements = (dependencies, doi) => pipe(
  doi,
  dependencies.getCurationStatements,
  RA.map(addGroupInformation(dependencies)),
  RA.rights,
  T.traverseArray(addEvaluationText(dependencies)),
  T.map(RA.rights),
);
