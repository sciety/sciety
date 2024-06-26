import { HtmlFragment } from '../../types/html-fragment';

export type NotHtml = string & { readonly NotHtml: unique symbol };

export type HtmlPageHead = {
  title: string,
  description?: NotHtml,
  openGraph?: {
    title: string,
    description: NotHtml,
  },
};

export type HtmlPage = HtmlPageHead & {
  tag: 'html-page',
  content: HtmlFragment,
};

export const toHtmlPage = (partial: Omit<HtmlPage, 'tag'>): HtmlPage => ({
  ...partial,
  tag: 'html-page',
});
