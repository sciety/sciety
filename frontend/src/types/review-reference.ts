import Doi from '../data/doi';

export default interface ReviewReference {
  articleDoi: Doi;
  reviewDoi: string;
}
