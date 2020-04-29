import { blankNode, quad, literal } from '@rdfjs/data-model';
import { schema } from '@tpluscode/rdf-ns-builders';
import clownface from 'clownface';
import datasetFactory from 'rdf-dataset-indexed';
import { FetchDataset } from '../../src/api/fetch-dataset';
import createFetchReview from '../../src/api/fetch-review';
import article3 from '../../src/data/article3';

describe('fetch-review', (): void => {
  it('returns the review', async () => {
    const fetchDataset: FetchDataset = async (iri) => {
      const authorIri = blankNode();

      return clownface({
        dataset: datasetFactory([
          quad(iri, schema.datePublished, literal('2020-02-20')),
          quad(iri, schema.description, literal('A summary')),
          quad(iri, schema.author, authorIri),
          quad(authorIri, schema.name, literal('Author name')),
        ]),
        term: iri,
      });
    };
    const fetchReview = createFetchReview(fetchDataset);
    const review = await fetchReview(article3.reviews[0].doi);
    expect(review.publicationDate).toStrictEqual(new Date('2020-02-20'));
  });
});
