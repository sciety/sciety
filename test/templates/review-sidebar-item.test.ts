import Doi from '../../src/data/doi';
import templateReviewSidebarItem from '../../src/templates/review-sidebar-item';

describe('review-sidebar-item template', (): void => {
  const review = {
    publicationDate: new Date('2010-02-01'),
    doi: new Doi('10.5281/zenodo.3678326'),
    editorialCommunityName: 'eLife',
  };

  it('renders inside an article tag', () => {
    const actual = templateReviewSidebarItem(review);

    expect(actual).toStrictEqual(expect.stringMatching(/^<article>/));
  });

  it('renders the link to a full review', () => {
    const actual = templateReviewSidebarItem(review);

    expect(actual).toStrictEqual(expect.stringContaining(`href="https://doi.org/${review.doi}"`));
  });

  it('renders the editorial community', () => {
    const actual = templateReviewSidebarItem(review);

    expect(actual).toStrictEqual(expect.stringContaining('eLife'));
  });

  it('renders the publication date', () => {
    const actual = templateReviewSidebarItem(review);

    expect(actual).toStrictEqual(expect.stringContaining('2010-02-01'));
  });
});
