import { ArticleId } from '../../src/types/article-id';
import { arbitraryWord } from '../helpers';

export const arbitraryDoi = (prefix = '10.1101'): ArticleId => new ArticleId(`${prefix}/${arbitraryWord(8)}`);
