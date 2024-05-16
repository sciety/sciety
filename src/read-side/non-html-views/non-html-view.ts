import * as TE from 'fp-ts/TaskEither';
import { NonHtmlViewError } from './non-html-view-error';
import { NonHtmlViewParams } from './non-html-view-params';
import { NonHtmlViewRepresentation } from './non-html-view-representation';

export type NonHtmlView = (
  nonHtmlViewParams: NonHtmlViewParams
) => TE.TaskEither<NonHtmlViewError, NonHtmlViewRepresentation>;
