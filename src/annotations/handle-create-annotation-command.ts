import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { Adapters } from '../infrastructure';
import { DoiFromString } from '../types/codecs/DoiFromString';
import { CommandResult } from '../types/command-result';
import { Doi } from '../types/doi';
import { HtmlFragment, htmlFragmentCodec } from '../types/html-fragment';

type CreateAnnotationCommand = {
  content: HtmlFragment,
  target: {
    articleId: Doi,
  },
};

type Body = {
  annotationContent: HtmlFragment,
  articleId: Doi,
};

const bodyCodec = t.type({
  annotationContent: htmlFragmentCodec,
  articleId: DoiFromString,
});

const transformToCommand = ({ annotationContent, articleId }: Body): CreateAnnotationCommand => ({
  content: annotationContent,
  target: {
    articleId,
  },
});

type HandleCreateAnnotationCommand = (adapters: Adapters) => (input: unknown) => TE.TaskEither<unknown, CommandResult>;

export const handleCreateAnnotationCommand: HandleCreateAnnotationCommand = (adapters) => (input) => pipe(
  input,
  bodyCodec.decode,
  E.map(transformToCommand),
  TE.fromEither,
  TE.chainFirstTaskK(
    (command) => T.of(
      adapters.logger('debug', 'Received CreateAnnotation command', { command }),
    ),
  ),
  TE.map(() => 'no-events-created'),
);
