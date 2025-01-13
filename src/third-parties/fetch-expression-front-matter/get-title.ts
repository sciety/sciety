import { pipe } from 'fp-ts/function';
import { CommonFrontMatter } from './parser-and-codec';
import { toHtmlFragment } from '../../types/html-fragment';
import { SanitisedHtmlFragment, sanitise } from '../../types/sanitised-html-fragment';

export const getTitle = (
  commonFrontmatter: CommonFrontMatter,
): SanitisedHtmlFragment => pipe(
  commonFrontmatter.titles[0].title,
  (title) => title.trim(),
  toHtmlFragment,
  sanitise,
);
