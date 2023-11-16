import { htmlEscape } from 'escape-goat';
import { pipe } from 'fp-ts/function';
import { UnsafeUserInput } from '../types/unsafe-user-input';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

const transformNewLineCharactersToBrTags = (plainText: string) => plainText.replaceAll('\n', '<br>\n');

export const safelyRenderUserInput = (
  content: UnsafeUserInput,
): HtmlFragment => pipe(
  htmlEscape(content),
  transformNewLineCharactersToBrTags,
  toHtmlFragment,
);
