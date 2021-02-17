import { EventEmitter } from 'events';
import { namedNode } from '@rdfjs/data-model';
import rdfFetch from '@rdfjs/fetch-lite';
import JsonLdParser from '@rdfjs/parser-jsonld';
import N3Parser from '@rdfjs/parser-n3';
import SinkMap from '@rdfjs/sink-map';
import clownface from 'clownface';
import parseLinkHeader from 'parse-link-header';
import datasetFactory from 'rdf-dataset-indexed';
import type { DatasetCore, NamedNode, Stream } from 'rdf-js';
import { Logger } from './logger';

export type FetchDataset = (iri: NamedNode) => Promise<clownface.GraphPointer<NamedNode>>;

export class FetchDatasetError extends Error {
  toString(): string {
    return `FetchDatasetError: ${this.message}`;
  }
}

export const createFetchDataset = (logger: Logger, fetch = rdfFetch): FetchDataset => {
  const factory = { dataset: datasetFactory };
  const parsers = new SinkMap<EventEmitter, Stream>();
  parsers.set('application/vnd.codemeta.ld+json', new JsonLdParser());
  parsers.set('text/turtle', new N3Parser());
  const fetchOptions = { factory, formats: { parsers } };

  return async (iri) => {
    logger('debug', 'Fetching dataset', { url: iri.value });
    const response = await fetch<DatasetCore>(iri.value, fetchOptions);

    if (!response.ok) {
      throw new FetchDatasetError(`Received a ${response.status} ${response.statusText} for ${response.url}`);
    }

    const links = parseLinkHeader(response.headers?.get('Link') ?? '');
    const term = links?.canonical ? namedNode(links.canonical.url) : iri;

    return clownface({ dataset: await response.dataset(), term });
  };
};
