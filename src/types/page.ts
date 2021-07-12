import { HtmlFragment } from './html-fragment';

export type Page = {
  title: string,
  description?: string,
  content: HtmlFragment,
  openGraph?: {
    title: string,
    description: string,
  },
};
