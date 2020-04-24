import { namedNode } from '@rdfjs/data-model';
import fetch from '@rdfjs/fetch-lite';
import JsonLdParser from '@rdfjs/parser-jsonld';
import SinkMap from '@rdfjs/sink-map';
import { EventEmitter } from 'events';
import datasetFactory from 'rdf-dataset-indexed';
import { DatasetCore, Stream } from 'rdf-js';
import createFetchReview from '../../src/api/fetch-review';
import article3 from '../../src/data/article3';

describe('fetch-review', (): void => {
  const parsers = new SinkMap<EventEmitter, Stream>();
  parsers.set('application/vnd.schemaorg.ld+json', new JsonLdParser());
  const fetchOptions = { factory: { dataset: datasetFactory }, formats: { parsers } };

  describe('review found', (): void => {
    it('returns the review', async () => {
      const fetchReview = createFetchReview();
      const review = await fetchReview(article3.reviews[0].doi);
      expect(review.doi).toBe(article3.reviews[0].doi);
    });
  });

  describe('review not found', (): void => {
    it('throws an error', () => {
      const fetchReview = createFetchReview();
      expect(fetchReview('10.1234/5678')).rejects.toStrictEqual(new Error('Review DOI 10.1234/5678 not found'));
    });
  });

  it('we can fetch metadata for a DOI', async () => {
    const response = await fetch<DatasetCore>(`https://doi.org/${article3.reviews[0].doi}`, fetchOptions);
    const dataset = await response.dataset();

    expect(dataset.match(namedNode(`https://doi.org/${article3.reviews[0].doi}`), namedNode('http://schema.org/name')).size).toBeGreaterThanOrEqual(1);
  });
});
