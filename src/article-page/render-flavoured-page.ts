import Doi from '../types/doi';

type RenderFlavouredPage = (doi: Doi) => string;

export default (): RenderFlavouredPage => (
  () => `
  Flavoured page
  `
);
