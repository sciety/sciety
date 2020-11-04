Sciety ingests data from hypothesis using their API at https://h.readthedocs.io/en/latest/api/

In order to gather more information we use a set of predetermined tags. When creating a new review, summary or author response on hypothesis our communities should use the following tags to give as much information as possible

## Type
`scietyType` 

### Current types
  - `PeerReview` - a review of an article by a member or members of the community
  - `ReviewSummary` - a summary of a number of reviews
  - `AuthorResponse` - a response from the paper's author(s)

### Examples

- `scietyType:PeerReview`
- `scietyType:ReviewSummary`
- `scietyType:AuthorResponse`

## Author

`scietyAuthor`

If the event has a specific author you can use this here. Any string value will be permitted. The author could be a real person or refer to a reviewer anonymously eg as "Reviewer 1". This may also be the author of the paper for an `AuthorResponse` if appropriate.

### Examples
- `scietyAuthor:Dr. H. Hausenbaum`
- `scietyAuthor:Reviewer 1`
