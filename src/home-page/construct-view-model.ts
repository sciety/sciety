import { Context, Middleware, Next } from 'koa';
import Doi from '../data/doi';

export default (): Middleware => (
  async (ctx: Context, next: Next): Promise<void> => {
    const { editorialCommunities } = ctx.state;

    ctx.state.viewModel = {
      mostRecentReviews: [
        {
          articleDoi: new Doi('10.1101/833392'),
          articleTitle: 'Uncovering the hidden antibiotic potential of Cannabis',
          editorialCommunityName: editorialCommunities['b560187e-f2fb-4ff9-a861-a204f3fc0fb0'].name,
        },
        {
          articleDoi: new Doi('10.1101/642017'),
          articleTitle: 'Toxoplasma gondii Infection Drives Conversion of NK Cells into ILC1s',
          editorialCommunityName: editorialCommunities['b560187e-f2fb-4ff9-a861-a204f3fc0fb0'].name,
        },
        {
          articleDoi: new Doi('10.1101/615682'),
          articleTitle: 'A genetic selection reveals functional metastable structures embedded in a toxin-encoding mRNA',
          editorialCommunityName: editorialCommunities['b560187e-f2fb-4ff9-a861-a204f3fc0fb0'].name,
        },
        {
          articleDoi: new Doi('10.1101/629618'),
          articleTitle: 'Androgen-regulated transcription of ESRP2 drives alternative splicing patterns in prostate cancer',
          editorialCommunityName: editorialCommunities['b560187e-f2fb-4ff9-a861-a204f3fc0fb0'].name,
        },
        {
          articleDoi: new Doi('10.1101/600445'),
          articleTitle: 'Extensive Ribosome and RF2 Rearrangements during Translation Termination',
          editorialCommunityName: editorialCommunities['b560187e-f2fb-4ff9-a861-a204f3fc0fb0'].name,
        },
      ],
    };

    await next();
  }
);
