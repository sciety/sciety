import * as TE from 'fp-ts/TaskEither';
import { toHtmlFragment } from '../../types/html-fragment';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';

type ListOfUserListsPage = TE.TaskEither<RenderPageError, Page>;

export const listOfUserListsPage = (): ListOfUserListsPage => (
  TE.right({
    title: 'Most active user lists',
    content: toHtmlFragment('Hello World!'),

  }));
