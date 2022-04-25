import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Adapters } from '../infrastructure';
import { CommandResult } from '../types/command-result';
import { HtmlFragment } from '../types/html-fragment';

type CreateAnnotationCommand = {
  content: HtmlFragment,
  target: {
    articleId: string,
  },
};

type Body = {
  annotationContent: HtmlFragment,
  articleId: string,
};

const translateCommand = ({ annotationContent, articleId }: Body): CreateAnnotationCommand => ({
  content: annotationContent,
  target: {
    articleId,
  },
});

type CreateAnnotation = (adapters: Adapters) => (input: unknown) => TE.TaskEither<string, CommandResult>;

export const createAnnotation: CreateAnnotation = (adapters) => (input) => pipe(
  input as Body,
  translateCommand,
  TE.right,
  TE.chainFirstTaskK(
    (command) => T.of(
      adapters.logger('debug', 'Received CreateAnnotation command', { command }),
    ),
  ),
  TE.map(() => 'no-events-created'),
);
