Sciety ingests data from hypothesis using their API at https://h.readthedocs.io/en/latest/api/

In order to gather more information we use a set of predetermined tags. When creating a new review, summary or author response on hypothesis our communities should use the following tags to give as much information as possible

## Event Type
`scietyEventType` 

### Types of event
  - `PeerReview` - a review of an article by a member or members of the community
  - `ReviewSummary` - a summary of a number of reviews
  - `AuthorResponse` - a response from the paper's author(s)

### Examples

- `scietyEventType:PeerReview`
- `scietyEventType:ReviewSummary`
- `scietyEventType:AuthorResponse`

## Event Date

`scietyEventDate`

The date that the event was first received. For example, with a PeerReview this would be the date that the review was received from the reviewer and not the date that the review was first posted online 

### Examples 

- `scietyEventDate:2020-10-14T00:00:00.000Z`
- `scietyEventDate:2020-03-11T15:15:31.830656+00:00`
- `scietyEventDate:2020-10-14`

## Event Author

`scietyEventAuthor`

If the event has a specific author you can use this here. Any string value will be permitted. The author could be a real person or refer to a reviewer anonymously eg as "Reviewer 1". This may also be the author of the paper for an `AuthorResponse`.

### Examples
- `scietyEventAuthor:Dr. H. Hausenbaum`
- `scietyEventAuthor:Reviewer 1`