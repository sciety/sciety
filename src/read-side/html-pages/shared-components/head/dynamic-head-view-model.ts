import { ClientClassification } from './client-classification';
import { HtmlPageHead } from '../../html-page';

export type DynamicHeadViewModel = HtmlPageHead & {
  clientClassification: ClientClassification,
};
