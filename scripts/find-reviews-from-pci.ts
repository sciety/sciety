import fs from 'fs';
import axios from 'axios';
import { DOMParser } from 'xmldom';

type PciCommunity = {
  id: string,
  prefix: string,
}

const pciCommunities: Array<PciCommunity> = [
  { id: '74fd66e9-3b90-4b5a-a4ab-5be83db4c5de', prefix: 'zool' },
  { id: '19b7464a-edbe-42e8-b7cc-04d1eb1f7332', prefix: 'evolbiol' },
  { id: '32025f28-0506-480e-84a0-b47ef1e92ec5', prefix: 'ecology' },
  { id: '4eebcec9-a4bb-44e1-bde3-2ae11e65daaa', prefix: 'animsci' },
  { id: 'b90854bf-795c-42ba-8664-8257b9c68b0c', prefix: 'archaeo' },
  { id: '7a9e97d1-c1fe-4ac2-9572-4ecfe28f9f84', prefix: 'paleo' },
];

const parser = new DOMParser({
  errorHandler: (_, msg) => {
    throw msg;
  },
});

const processCommunity = async (community: PciCommunity): Promise<Array<string>> => {
  process.stderr.write(`Fetching reviews for ${community.prefix}\n`);
  const result = [];
  result.push('Date,Article DOI,Review ID\n');

  const { data: feed } = await axios.get(`https://${community.prefix}.peercommunityin.org/public/rss4bioRxiv`);
  const doc = parser.parseFromString(feed, 'text/xml');

  for (const link of Array.from(doc.getElementsByTagName('link'))) {
    const url = link.getElementsByTagName('url')[0];
    const articleDoi = link.getElementsByTagName('doi')[0]?.textContent ?? '';

    if (articleDoi.startsWith('10.1101/')) {
      const { data } = await axios.get<string>(url?.textContent ?? '');
      const [, date] = /<meta name="citation_publication_date" content="(.*?)" \/>/.exec(data) ?? [];
      const [, reviewDoi] = /<meta name="citation_doi" content="(.*?)" \/>/.exec(data) ?? [];
      result.push(`${new Date(date).toISOString()},${articleDoi.trim()},doi:${reviewDoi}\n`);
    }
  }
  process.stderr.write(`Fetched ${result.length - 1} reviews for ${community.prefix}\n`);
  return result;
};

void (async (): Promise<void> => {
  pciCommunities.forEach(async (community) => {
    const lines = await processCommunity(community);
    const filename = `./data/reviews/${community.id}.csv`;
    fs.writeFileSync(filename, lines.join(''));
    process.stderr.write(`Written reviews to ${filename}\n`);
  });
})();
