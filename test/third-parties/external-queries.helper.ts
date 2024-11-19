import * as O from 'fp-ts/Option';
import { ExpressionFrontMatter } from '../../src/types/expression-front-matter';
import { arbitrarySanitisedHtmlFragment, arbitraryString } from '../helpers';

export const arbitraryExpressionFrontMatter = (): ExpressionFrontMatter => ({
  abstract: O.some(arbitrarySanitisedHtmlFragment()),
  authors: O.some([arbitraryString()]),
  title: arbitrarySanitisedHtmlFragment(),
});
