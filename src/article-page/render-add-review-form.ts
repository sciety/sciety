import addReviewForm from './templates/add-review-form';
import Doi from '../data/doi';
import EditorialCommunityRepository from '../types/editorial-community-repository';

export default (
  editorialCommunities: EditorialCommunityRepository,
) => (
  (doi: Doi): string => `
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
