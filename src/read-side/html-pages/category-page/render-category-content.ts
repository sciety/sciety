import { ViewModel } from './view-model';
import { HtmlFragment } from '../../../types/html-fragment';
import { renderArticleCard } from '../shared-components/article-card';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const renderCategoryContent = (viewModel: ViewModel['categoryContent']): HtmlFragment => renderArticleCard(viewModel);
