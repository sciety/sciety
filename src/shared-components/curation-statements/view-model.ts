import * as O from 'fp-ts/Option';
import * as GID from '../../types/group-id';
import { LanguageCode } from '../lang-attribute';
import { EvaluationLocator } from '../../types/evaluation-locator';

export type ViewModel = {
  groupId: GID.GroupId,
  groupName: string,
  groupSlug: string,
  groupLogo: O.Option<string>,
  statement: string,
  statementLanguageCode: O.Option<LanguageCode>,
  evaluationLocator: EvaluationLocator,
};
