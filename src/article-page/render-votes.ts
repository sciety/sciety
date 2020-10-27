export type RenderVotes = (upVotes: number, downVotes: number) => Promise<string>;

export default (): RenderVotes => (
  async (upVotes, downVotes) => `
    <div>
      ${upVotes} people found this helpful,<br/>
      ${downVotes} people found this to be unhelpful
    </div>
  `
);
