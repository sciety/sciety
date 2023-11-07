import { HtmlFragment } from '../types/html-fragment';

export type HtmlPage = {
  title: string,
  description?: string,
  content: HtmlFragment,
  openGraph?: {
    title: string,
    description: string,
  },
};
