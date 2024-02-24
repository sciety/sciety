import * as O from 'fp-ts/Option';
import * as GID from '../../types/group-id.js';
import { LanguageCode } from '../../shared-components/lang-attribute/index.js';
import { EvaluationLocator } from '../../types/evaluation-locator.js';

export type CurationStatement = {
  groupId: GID.GroupId,
  groupName: string,
  groupLogo: O.Option<string>,
  groupPageHref: string,
  statement: string,
  statementLanguageCode: O.Option<LanguageCode>,
  evaluationLocator: EvaluationLocator,
};
