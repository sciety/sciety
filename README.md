# prc

## How to run

```
cd frontend
docker build -t liberoadmin/prc-frontend:local .
docker run -v $(pwd)/static:/usr/share/nginx/html:ro -p 8080:80 liberoadmin/prc-frontend:local
```
