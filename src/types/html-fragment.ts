export type HtmlFragment = string & { readonly HtmlFragment: unique symbol };

export const toHtmlFragment = (value: string): HtmlFragment => value as HtmlFragment;
