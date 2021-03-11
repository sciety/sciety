import fs from 'fs';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import { DOMParser } from 'xmldom';

type PciCommunity = {
  id: string,
  prefix: string,
  url: string,
};

const pciCommunities: Array<PciCommunity> = [
  { id: '74fd66e9-3b90-4b5a-a4ab-5be83db4c5de', prefix: 'zool', url: 'https://zool.peercommunityin.org/rss/rss4elife' },
  { id: '19b7464a-edbe-42e8-b7cc-04d1eb1f7332', prefix: 'evolbiol', url: 'https://evolbiol.peercommunityin.org/public/rss4bioRxiv' },
  { id: '32025f28-0506-480e-84a0-b47ef1e92ec5', prefix: 'ecology', url: 'https://ecology.peercommunityin.org/rss/rss4elife' },
  { id: '4eebcec9-a4bb-44e1-bde3-2ae11e65daaa', prefix: 'animsci', url: 'https://animsci.peercommunityin.org/public/rss4bioRxiv' },
  { id: 'b90854bf-795c-42ba-8664-8257b9c68b0c', prefix: 'archaeo', url: 'https://archaeo.peercommunityin.org/public/rss4bioRxiv' },
  { id: '7a9e97d1-c1fe-4ac2-9572-4ecfe28f9f84', prefix: 'paleo', url: 'https://paleo.peercommunityin.org/public/rss4bioRxiv' },
];

const parser = new DOMParser({
  errorHandler: (_, msg) => {
    throw msg;
  },
});

type Recommendation = {
  date: Date,
  articleDoi: string,
  reviewDoi: string,
};

const fetchPage = async (url: string): Promise<{ data: string }> => {
  try {
    return await axios.get(url);
  } catch (e: unknown) {
    process.stderr.write(`Could not fetch ${url}\n`);
    throw e;
  }
};

const findRecommendations = async (community: PciCommunity): Promise<Array<Recommendation>> => {
  const result = [];

  const { data: feed } = await fetchPage(community.url);
  const doc = parser.parseFromString(feed, 'text/xml');

  for (const link of Array.from(doc.getElementsByTagName('link'))) {
    const url = link.getElementsByTagName('url')[0];
    const articleDoiString = link.getElementsByTagName('doi')[0]?.textContent ?? '';

    const bioAndmedrxivDoiRegex = /^\s*(?:doi:|(?:(?:https?:\/\/)?(?:dx\.)?doi\.org\/))?(10\.1101\/(?:[^%"#?\s])+)\s*$/;
    const [, articleDoi] = bioAndmedrxivDoiRegex.exec(articleDoiString) ?? [];

    if (articleDoi) {
      const { data: html } = await fetchPage(url?.textContent ?? '');
      const { document } = new JSDOM(html).window;
      const source = document.querySelector('.pci-recomOfSource')?.textContent;
      if (!source) {
        throw new Error(`Cannot find pci-recomOfSource element for ${articleDoi}`);
      }
      const date = document.querySelector('meta[name="citation_publication_date"]')?.getAttribute('content');
      if (!date) {
        throw new Error(`Unable to get citation publication date for ${articleDoi}`);
      }
      if (Number.isNaN(Date.parse(date))) {
        throw new Error(`Unable to parse the citation publication date for ${articleDoi}: ${date}`);
      }
      const reviewDoiMeta = document.querySelector('meta[name="citation_doi"]')?.getAttribute('content') ?? '';
      const [, reviewDoi] = bioAndmedrxivDoiRegex.exec(reviewDoiMeta) ?? [];
      if (!reviewDoi) {
        throw new Error(`Unable to get the review (citation) doi for ${articleDoi}`);
      }
      result.push({
        date: new Date(date),
        articleDoi,
        reviewDoi,
      });
    }
  }

  return result;
};

void (async (): Promise<void> => {
  pciCommunities.forEach(async (community) => {
    const recommendations = await findRecommendations(community);

    if (recommendations.length === 0) {
      process.stderr.write(`No recommendations found for ${community.prefix}\n`);
      return;
    }

    const reviewsFilename = `./data/reviews/${community.id}.csv`;
    const contents = recommendations.map((recommendation) => (
      `${recommendation.date.toISOString()},${recommendation.articleDoi},doi:${recommendation.reviewDoi}`
    )).join('\n');
    fs.writeFileSync(reviewsFilename, `Date,Article DOI,Review ID\n${contents}\n`);
    process.stderr.write(`Written ${recommendations.length} reviews to ${reviewsFilename} for ${community.prefix}\n`);
  });
})();
