doi=$1
doi_dot_org=$(curl -s -o /dev/null -w "%{http_code}\n" https://doi.org/$doi)
biorxiv=$(curl -s https://api.biorxiv.org/details/biorxiv/$doi | jq '.messages[0].status')
medrxiv=$(curl -s https://api.biorxiv.org/details/medrxiv/$doi | jq '.messages[0].status')

echo $doi,$doi_dot_org,$biorxiv,$medrxiv