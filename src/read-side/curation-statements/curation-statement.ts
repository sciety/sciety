import * as O from 'fp-ts/Option';
import { LanguageCode } from '../../shared-components/lang-attribute';
import { EvaluationLocator } from '../../types/evaluation-locator';
import * as GID from '../../types/group-id';

export type CurationStatement = {
  groupId: GID.GroupId,
  groupName: string,
  groupLogoSrc: O.Option<string>,
  groupPageHref: string,
  statement: string,
  statementLanguageCode: O.Option<LanguageCode>,
  evaluationLocator: EvaluationLocator,
};
