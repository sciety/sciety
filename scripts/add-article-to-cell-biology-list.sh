
curl -v -H "Authorization: Bearer $INGESTION_AUTH_BEARER_TOKEN" -X POST http://localhost:8080/add-article-to-list -H "Content-type: application/json" -d '{"articleId": "'$1'", "listId": "cb15ef21-944d-44d6-b415-a3d8951e9e8b"}'
