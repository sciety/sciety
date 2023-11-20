import { HtmlFragment } from '../types/html-fragment';

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
