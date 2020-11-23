Sciety ingests data from hypothesis using their API at https://h.readthedocs.io/en/latest/api/

In order to gather more information we use a set of predetermined tags. When creating a new review, summary or author response on hypothesis our communities should use the following tags to give as much information as possible

## Type
`type`

### Current types
  - `PeerReview` - a review of an article by a member or members of the community
  - `ReviewSummary` - a summary of a number of reviews
  - `AuthorResponse` - a response from the paper's author(s)
  - `InRevisionNotice` - a decision letter or review summary that indicates reviews have been conducted but revisions are in progress and a final recommendation is yet to be made

### Examples
- `type:PeerReview`
- `type:ReviewSummary`
- `type:AuthorResponse`

## Creator
`creator`

If the event has a specific creator you can include this here. Any string value will be permitted. The creator could be a real person or refer to a reviewer anonymously eg as "Reviewer 1". This may also be the corresponding author of the paper for an `AuthorResponse` if appropriate.

### Examples
- `creator:Dr. H. Hausenbaum`
- `creator:Reviewer 1`
