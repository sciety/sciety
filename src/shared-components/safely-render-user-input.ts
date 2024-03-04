import { htmlEscape } from 'escape-goat';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { RawUserInput } from '../read-models/annotations/handle-event';

const transformNewLineCharactersToBrTags = (plainText: string) => plainText.replaceAll('\n', '<br>\n');

export const safelyRenderUserInput = (
  input: RawUserInput,
): HtmlFragment => pipe(
  htmlEscape(input.content),
  transformNewLineCharactersToBrTags,
  toHtmlFragment,
);

export const safelyReflectUserInputForEditing = (
  input: RawUserInput,
): HtmlFragment => pipe(
  htmlEscape(input.content),
  toHtmlFragment,
);

export const renderUserInputForJsonApi = (input: RawUserInput): string => input.content;
