import { HtmlFragment } from './html-fragment';

export type SanitisedHtmlFragment = HtmlFragment & { readonly SanitisedHtmlFragment: unique symbol };

export const toSanitisedHtmlFragment = (value: HtmlFragment): SanitisedHtmlFragment => value as SanitisedHtmlFragment;
