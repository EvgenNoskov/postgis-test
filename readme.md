Demo app using next+leafet and flask+postgis to store simple geo markers

1. Dev environment setup:

```shell
docker compose -p postgis-dev -f docker-compose.dev.yaml up --detach
cd ./server
flask init-db
```

2. Start dev backend server:

```shell
cd ./server
flask run --debug
```

2. Start dev app-web server:

```shell
cd ./app-web
npm run dev
```

3. Pgadmin access:
    - Goto http://localhost:8080
    login: pgadmin@example.com
    password: 12345678
    - Add new server
    name: postgress
    host: host.docker.internal
    user: postgres
    password: 12345678
