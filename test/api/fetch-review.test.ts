import { literal } from '@rdfjs/data-model';
import { schema } from '@tpluscode/rdf-ns-builders';
import clownface from 'clownface';
import datasetFactory from 'rdf-dataset-indexed';
import { FetchDataset } from '../../src/api/fetch-dataset';
import createFetchReview from '../../src/api/fetch-review';
import Doi from '../../src/data/doi';

const reviewDoi = new Doi('10.5281/zenodo.3678325');

describe('fetch-review', (): void => {
  it('returns the review', async () => {
    const fetchDataset: FetchDataset = async (iri) => (
      clownface({ dataset: datasetFactory(), term: iri })
        .addOut(schema.datePublished, literal('2020-02-20', schema.Date))
        .addOut(schema.description, 'A summary')
    );
    const fetchReview = createFetchReview(fetchDataset);
    const review = await fetchReview(reviewDoi);

    expect(review.publicationDate).toStrictEqual(new Date('2020-02-20'));
  });
});
