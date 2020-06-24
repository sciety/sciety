import { EventEmitter } from 'events';
import { namedNode } from '@rdfjs/data-model';
import rdfFetch from '@rdfjs/fetch-lite';
import JsonLdParser from '@rdfjs/parser-jsonld';
import N3Parser from '@rdfjs/parser-n3';
import SinkMap from '@rdfjs/sink-map';
import clownface, { Clownface } from 'clownface';
import parseLinkHeader from 'parse-link-header';
import datasetFactory from 'rdf-dataset-indexed';
import { DatasetCore, NamedNode, Stream } from 'rdf-js'; // eslint-disable-line import/no-extraneous-dependencies
import createLogger from '../logger';

export type FetchDataset = (iri: NamedNode) => Promise<Clownface<NamedNode>>;

export class FetchDatasetError extends Error {
  toString(): string {
    return `FetchDatasetError: ${this.message}`;
  }
}

export default (fetch = rdfFetch): FetchDataset => {
  const log = createLogger('api:fetch-dataset');
  const factory = { dataset: datasetFactory };
  const parsers = new SinkMap<EventEmitter, Stream>();
  parsers.set('application/vnd.codemeta.ld+json', new JsonLdParser());
  parsers.set('text/turtle', new N3Parser());
  const fetchOptions = { factory, formats: { parsers } };

  return async (iri: NamedNode): Promise<Clownface<NamedNode>> => {
    log(`Fetching dataset for ${iri.value}`);
    const response = await fetch<DatasetCore>(iri.value, fetchOptions);

    if (!response.ok) {
      throw new FetchDatasetError(`Received a ${response.status} ${response.statusText} for ${response.url}`);
    }

    const links = parseLinkHeader(response.headers?.get('Link') ?? '');
    const term = links?.canonical ? namedNode(links.canonical.url) : iri;

    return clownface({ dataset: await response.dataset(), term });
  };
};
