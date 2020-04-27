import { EventEmitter } from 'events';
import fetch from '@rdfjs/fetch-lite';
import JsonLdParser from '@rdfjs/parser-jsonld';
import SinkMap from '@rdfjs/sink-map';
import datasetFactory from 'rdf-dataset-indexed';
import { DatasetCore, NamedNode, Stream } from 'rdf-js';
import createLogger from '../logger';

export type FetchDataset = (iri: NamedNode) => Promise<DatasetCore>;

export default (): FetchDataset => {
  const log = createLogger('api:fetch-dataset');
  const factory = { dataset: datasetFactory };
  const parsers = new SinkMap<EventEmitter, Stream>();
  parsers.set('application/vnd.schemaorg.ld+json', new JsonLdParser());
  const fetchOptions = { factory, formats: { parsers } };

  return async (iri: NamedNode): Promise<DatasetCore> => {
    log(`Fetching dataset for ${iri.value}`);
    const response = await fetch<DatasetCore>(iri.value, fetchOptions);

    if (!response.ok) {
      throw new Error(`Received a ${response.status} ${response.statusText} for ${response.url}`);
    }

    return response.dataset();
  };
};
