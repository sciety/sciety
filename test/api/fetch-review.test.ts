import { literal } from '@rdfjs/data-model';
import { schema } from '@tpluscode/rdf-ns-builders';
import clownface from 'clownface';
import datasetFactory from 'rdf-dataset-indexed';
import { FetchDataset } from '../../src/api/fetch-dataset';
import createFetchReview from '../../src/api/fetch-review';
import { article3Review1 } from '../../src/data/review-dois';

describe('fetch-review', (): void => {
  it('returns the review', async () => {
    const fetchDataset: FetchDataset = async (iri) => (
      clownface({ dataset: datasetFactory(), term: iri })
        .addOut(schema.datePublished, literal('2020-02-20', schema.Date))
        .addOut(schema.description, 'A summary')
        .addOut(schema.author, (author) => author.addOut(schema.name, 'Author name'))
    );
    const fetchReview = createFetchReview(fetchDataset);
    const review = await fetchReview(article3Review1);

    expect(review.publicationDate).toStrictEqual(new Date('2020-02-20'));
  });
});
