import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { toHtmlFragment } from '../../types/html-fragment';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { ListCardViewModel } from '../../shared-components/list-card/render-list-card';

type ViewModel = ReadonlyArray<ListCardViewModel>;

const constructViewModel = () => [];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const renderAsHtml = (viewModel: ViewModel): Page => ({
  title: 'Most active user lists',
  content: toHtmlFragment('Hello World!'),
});

type ListOfUserListsPage = TE.TaskEither<RenderPageError, Page>;

export const listOfUserListsPage = (): ListOfUserListsPage => pipe(
  constructViewModel(),
  renderAsHtml,
  TE.right,
);
