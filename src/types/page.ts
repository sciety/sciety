import { HtmlFragment } from './html-fragment';

export type Page = {
  title: string,
  content: HtmlFragment,
  openGraph?: {
    title: string,
    description: string,
  },
};
