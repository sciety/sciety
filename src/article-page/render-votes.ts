export type RenderVotes = () => Promise<string>;

type GetVotes = () => Promise<{upVotes: number, downVotes: number}>;

export default (getVotes: GetVotes): RenderVotes => (
  async () => {
    const { upVotes, downVotes } = await getVotes();
    return `
    <div>
      ${upVotes} people found this helpful,<br/>
      ${downVotes} people found this to be unhelpful
    </div>
  `;
  }
);
