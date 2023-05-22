/* eslint-disable no-param-reassign */
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import {
  DomainEvent, isEventOfType,
} from '../../domain-events';
import { ArticleAuthors } from '../../types/article-authors';
import { ArticleServer } from '../../types/article-server';
import { Doi } from '../../types/doi';
import { toHtmlFragment } from '../../types/html-fragment';
import { SanitisedHtmlFragment, sanitise } from '../../types/sanitised-html-fragment';

export type ArticleDetails = {
  abstract: SanitisedHtmlFragment,
  authors: ArticleAuthors,
  doi: Doi,
  title: SanitisedHtmlFragment,
  server: ArticleServer,
};

export type ReadModel = Map<string, ArticleDetails>;

export const initialState = (): ReadModel => new Map();

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEventOfType('ArticleDetailsRecorded')(event)) {
    readmodel.set(event.doi.value, {
      doi: event.doi,
      title: pipe(event.title, toHtmlFragment, sanitise),
      abstract: pipe(event.abstract, toHtmlFragment, sanitise),
      server: event.server,
      authors: O.some(event.authors),
    });
  }
  return readmodel;
};
