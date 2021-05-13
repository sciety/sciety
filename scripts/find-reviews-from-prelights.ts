import axios from 'axios';

const key = process.env.PRELIGHTS_FEED_KEY ?? '';

void (async (): Promise<void> => {
  process.stdout.write(JSON.stringify((await axios.get(
    `https://stage-pph.velocityred.com/feed/sciety/?key=${key}`, {
      headers: {
        'User-Agent': 'Sciety (http://sciety.org; mailto:team@sciety.org)',
      },
    },
  )).data));
})();
