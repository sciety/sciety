import * as O from 'fp-ts/Option';
import { EvaluationLocator } from '../../types/evaluation-locator';
import * as GID from '../../types/group-id';
import { LanguageCode } from '../html-pages/shared-components/lang-attribute';

export type CurationStatement = {
  groupId: GID.GroupId,
  groupName: string,
  groupLogoSrc: O.Option<string>,
  groupPageHref: string,
  statement: string,
  statementLanguageCode: O.Option<LanguageCode>,
  evaluationLocator: EvaluationLocator,
};
