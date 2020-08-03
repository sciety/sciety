import templateDate from '../templates/date';
import templateListItems from '../templates/list-items';

type RenderFeed = () => Promise<string>;

type Event = {
  imageUrl: string;
  date: Date;
  summary: string;
};

const events: Array<Event> = [
  {
    imageUrl: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_bigger.png',
    date: new Date('2020-07-09'),
    summary: `
      <a href="/editorial-communities/10360d97-bf52-4aef-b2fa-2f60d319edd8">
        A PREreview Journal Club
      </a> reviewed <a href="/articles/10.1101/2020.01.22.915660">Functional assessment of cell entry and receptor usage for lineage B β-coronaviruses, including 2019-nCoV</a>
    `,
  },
  {
    imageUrl: 'https://pbs.twimg.com/profile_images/1095287970939265026/xgyGFDJk_200x200.jpg',
    date: new Date('2020-07-09'),
    summary: `
      <a href="/editorial-communities/53ed5364-a016-11ea-bb37-0242ac130002">PeerJ</a> reviewed <a href="/articles/10.1101/751099">Diffusion tubes: a method for the mass culture of ctenophores and other pelagic marine invertebrates</a>
    `,
  },
];

export default (): RenderFeed => {
  const feedItems = events.map((event) => `
    <div class="label">
      <img src="${event.imageUrl}">
    </div>
    <div class="content">
      <div class="date">
        ${templateDate(event.date)}
      </div>
      <div class="summary">
        ${event.summary}
      </div>
    </div>
  `);
  return async () => (`
    <section>
      <h2 class="ui header">
        Feed
      </h2>
      <ol class="ui large feed">
        ${templateListItems(feedItems, 'event')}
        <li class="event">
          <div class="label">
            <img src="https://pbs.twimg.com/profile_images/1204012644660854784/E8JhkG7__200x200.jpg">
          </div>
          <div class="content">
            <time datetime="2020-07-09" title="July 9, 2020" class="date">
              July 9
            </time>
            <div class="summary">
              <a href="/editorial-communities/316db7d9-88cc-4c26-b386-f067e0f56334">
                Review Commons
              </a>
              reviewed
              <a href="/articles/10.1101/2019.12.13.875419">
                Unconventional kinetochore kinases KKT2 and KKT3 have a unique zinc finger that promotes their
                kinetochore localization
              </a>
            </div>
          </div>
        </li>
        <li class="event">
          <div class="label">
            <img src="https://pbs.twimg.com/profile_images/1239550325188710402/7_lY-IyL_200x200.png">
          </div>
          <div class="content">
            <time datetime="2020-07-08" title="July 8, 2020" class="date">July 8</time>
            <div class="summary">
              <a href="/editorial-communities/b560187e-f2fb-4ff9-a861-a204f3fc0fb0">
                eLife
              </a>
              reviewed
              <a href="/articles/10.1101/2020.05.14.095547">
                GATA-1-dependent histone H3K27ac mediates erythroid cell-specific interaction between CTCF sites
              </a>
            </div>
          </div>
        </li>

        <li class="event">
          <div class="label">
            <img src="https://pbs.twimg.com/profile_images/1095287970939265026/xgyGFDJk_200x200.jpg">
          </div>
          <div class="content">
            <time datetime="2020-07-08" title="July 8, 2020" class="date">July 8</time>
            <div class="summary">
              <a href="/editorial-communities/53ed5364-a016-11ea-bb37-0242ac130002">
                PeerJ
              </a>
              endorsed
              <a href="/articles/10.1101/751099">
                Diffusion tubes: a method for the mass culture of ctenophores and other pelagic marine invertebrates
              </a>
            </div>
          </div>
        </li>

        <li class="event">
          <div class="label">
            <img src="https://pbs.twimg.com/profile_images/1239550325188710402/7_lY-IyL_200x200.png">
          </div>
          <div class="content">
            <time datetime="2020-07-08" title="Jul 8, 2020" class="date">
              July 8
            </time>
            <div class="summary">
              <a href="/editorial-communities/b560187e-f2fb-4ff9-a861-a204f3fc0fb0">
                eLife
              </a>
              reviewed
              <a href="/articles/10.1101/2020.05.14.095547">
                GATA-1-dependent histone H3K27ac mediates erythroid cell-specific interaction between CTCF sites
              </a>
            </div>
          </div>
        </li>
        <li class="event">
          <div class="label">
            <img src="https://pbs.twimg.com/profile_images/1204012644660854784/E8JhkG7__200x200.jpg">
          </div>
          <div class="content">
            <time datetime="2020-06-18" title="Jun 18, 2020" class="date">
              June 18
            </time>
            <div class="summary">
              <a href="/editorial-communities/316db7d9-88cc-4c26-b386-f067e0f56334">
                Review Commons
              </a>
              joined The Hive
            </div>
          </div>
        </li>
        <li class="event">
          <div class="label">
            <img src="https://abs.twimg.com/sticky/default_profile_images/default_profile_bigger.png">
          </div>
          <div class="content">
            <time datetime="2020-06-14" title="Jun 14, 2020" class="date">
              June 14
            </time>
            <div class="summary">
              <a href="/editorial-communities/10360d97-bf52-4aef-b2fa-2f60d319edd8">
                A PREreview Journal Club
              </a>
              joined The Hive
            </div>
          </div>
        </li>
      </ol>
    </section>
  `);
};
