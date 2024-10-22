import * as O from 'fp-ts/Option';
import { ClientClassification } from './client-classification';
import { UserId } from '../../../../types/user-id';
import { HtmlPageHead } from '../../html-page';

export type DynamicHeadViewModel = HtmlPageHead & {
  loggedInUserId: O.Option<UserId>,
  clientClassification: ClientClassification,
};
