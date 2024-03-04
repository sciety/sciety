import { htmlEscape } from 'escape-goat';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { RawUserInput } from '../read-side';

const transformNewLineCharactersToBrTags = (plainText: string) => plainText.replaceAll('\n', '<br>\n');

export const safelyRenderRawUserInput = (
  input: RawUserInput,
): HtmlFragment => pipe(
  htmlEscape(input.content),
  transformNewLineCharactersToBrTags,
  toHtmlFragment,
);

export const safelyReflectRawUserInputForEditing = (input: RawUserInput): string => htmlEscape(input.content);

export const renderRawUserInputForJsonApi = (input: RawUserInput): string => input.content;
