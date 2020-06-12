import templateHeader from './templates/header';
import templateReviewedArticles from './templates/reviewed-articles';
import Doi from '../data/doi';

interface EditorialCommunity {
  name: string;
  description: string;
  logo?: string;
  reviewedArticles: Array<{
    doi: Doi;
    title: string;
  }>;
}

type RenderPageHeader = () => Promise<string>;

const createRenderPageHeader = (viewModel: EditorialCommunity): RenderPageHeader => (
  async () => Promise.resolve(templateHeader(viewModel))
);

export default async (viewModel: EditorialCommunity): Promise<string> => {
  const renderPageHeader = createRenderPageHeader(viewModel);

  return `
    ${await renderPageHeader()}
    ${templateReviewedArticles(viewModel.reviewedArticles)}
  `;
};
