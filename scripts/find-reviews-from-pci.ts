import axios from 'axios';
import { DOMParser } from 'xmldom';

const pciCommunityprefix = process.argv[2];

const parser = new DOMParser({
  errorHandler: (_, msg) => {
    throw msg;
  },
});

void (async (): Promise<void> => {
  process.stdout.write('Date,Article DOI,Review ID\n');

  const { data: feed } = await axios.get(`https://${pciCommunityprefix}.peercommunityin.org/public/rss4bioRxiv`);
  const doc = parser.parseFromString(feed, 'text/xml');

  for (const link of Array.from(doc.getElementsByTagName('link'))) {
    const url = link.getElementsByTagName('url')[0];
    const { data } = await axios.get<string>(url?.textContent ?? '');
    const [,date] = /<meta name="citation_publication_date" content="(.*?)" \/>/.exec(data) ?? [];
    const articleDoi = '';
    const [,reviewDoi] = /<meta name="citation_doi" content="(.*?)" \/>/.exec(data) ?? [];
    process.stdout.write(`${new Date(date).toISOString()},${articleDoi},${reviewDoi}\n`);
  }
})();
