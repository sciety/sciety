import { htmlEscape } from 'escape-goat';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment.js';
import { RawUserInput } from '../read-models/annotations/handle-event.js';

const transformNewLineCharactersToBrTags = (plainText: string) => plainText.replaceAll('\n', '<br>\n');

export const safelyRenderUserInput = (
  input: RawUserInput,
): HtmlFragment => pipe(
  htmlEscape(input.content),
  transformNewLineCharactersToBrTags,
  toHtmlFragment,
);
