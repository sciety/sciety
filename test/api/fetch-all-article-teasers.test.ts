import { dcterms, foaf } from '@tpluscode/rdf-ns-builders';
import clownface from 'clownface';
import datasetFactory from 'rdf-dataset-indexed';
import createFetchAllArticleTeasers from '../../src/api/fetch-all-article-teasers';
import { FetchDataset } from '../../src/api/fetch-dataset';
import Doi from '../../src/data/doi';
import ReviewReferenceRepository from '../../src/types/review-reference-repository';
import shouldNotBeCalled from '../should-not-be-called';

describe('fetch-all-article-teasers', (): void => {
  it('returns the teasers', async () => {
    const reviewReferenceRepository: ReviewReferenceRepository = {
      add: shouldNotBeCalled,
      findReviewDoisForArticleDoi: () => [new Doi('10.5555/987654321')],
    };
    const fetchDataset: FetchDataset = async (iri) => (
      clownface({ dataset: datasetFactory(), term: iri })
        .addOut(dcterms.title, 'Article title')
        .addOut(dcterms.creator, (author) => author.addOut(foaf.name, 'Josiah S. Carberry'))
        .addOut(dcterms.creator, (author) => author.addOut(foaf.name, 'Albert Einstein'))
    );
    const fetchAllArticleTeasers = createFetchAllArticleTeasers(reviewReferenceRepository, fetchDataset);
    const teasers = await fetchAllArticleTeasers();

    expect(teasers).toHaveLength(2);
    expect(teasers[0].title).toStrictEqual('Article title');
    expect(teasers[0].authors).toContain('Josiah S. Carberry');
    expect(teasers[0].authors).toContain('Albert Einstein');
  });
});
