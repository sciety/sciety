doi=$1
doi_dot_org=$(curl -s -o /dev/null -w "%{http_code}\n" https://doi.org/$doi)
biorxiv=$(curl -s https://api.biorxiv.org/details/biorxiv/$doi | jq '.messages[0].status')
medrxiv=$(curl -s https://api.biorxiv.org/details/medrxiv/$doi | jq '.messages[0].status')
crossref=$(curl -s -o /dev/null -w "%{http_code}\n" https://api.crossref.org/works/$doi/transform -H "Accept: application/vnd.crossref.unixref+xml")
number_of_events=$(grep $doi ./data/exploratory-test-from-prod.csv | wc -l)

echo $doi,$doi_dot_org,$biorxiv,$medrxiv,$crossref,$number_of_events
