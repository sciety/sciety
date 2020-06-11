import addReviewForm from './templates/add-review-form';
import Doi from '../data/doi';
import EditorialCommunityRepository from '../types/editorial-community-repository';

type RenderAddReviewForm = (doi: Doi) => string;

export default (
  editorialCommunities: EditorialCommunityRepository,
): RenderAddReviewForm => (
  (doi) => `
    <h2 class="ui top attached header">
      Add a review to this article
    </h2>
    <div class="ui attached segment">
      ${addReviewForm(doi, editorialCommunities)}
    </div>
    <p class="ui bottom attached warning message">
      This platform is for demonstration purposes only and data entered may not persist.
    </p>
  `
);
