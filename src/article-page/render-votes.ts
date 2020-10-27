export type RenderVotes = (upVotes: number, downVotes: number) => string;

export default (): RenderVotes => (
  (upVotes, downVotes) => `
    <div>
      ${upVotes} people found this helpful,<br/>
      ${downVotes} people found this to be unhelpful
    </div>
  `
);
