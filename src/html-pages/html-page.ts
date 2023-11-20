import { HtmlFragment } from '../types/html-fragment';

export type NotHtml = string & { readonly NotHtml: unique symbol };

export type HtmlPageHead = {
  title: string,
  description?: string,
  openGraph?: {
    title: string,
    description: string,
  },
};

export type HtmlPage = HtmlPageHead & {
  content: HtmlFragment,
};
