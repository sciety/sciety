import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../domain-events';
import { Doi } from '../types/doi';
import { GroupId } from '../types/group-id';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';
import { ReviewId } from '../types/review-id';

const renderContent = (item: string) => toHtmlFragment(`
  <h1>All events</h1>
  <ol>
    <li>${item}</li>
  </ol>
`);

export const allEventsPage = (): TE.TaskEither<RenderPageError, Page> => pipe(
  T.of({
    type: 'EditorialCommunityReviewedArticle' as const,
    date: new Date('2021-09-10'),
    editorialCommunityId: 'kdasjkd' as GroupId,
    articleId: new Doi('10.1101/1111111'),
    reviewId: 'doi:10.1101/9999999' as ReviewId,
  }),
  T.map((event: DomainEvent) => event.date),
  T.map((eventDate: Date) => E.right({
    title: 'All events',
    content: renderContent(eventDate.toISOString()),
  })),
);
