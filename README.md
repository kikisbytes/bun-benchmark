## Services
- Prometheus: localhost:9090 
- Prometheus log exporter(express): localhost:9092
- Grafana: localhost:3000
- Postgres: localhost:5432
- Websocket: localhost:4080
- Express/Elysia: localhost:4000

## How to run
1. Update Dockerfile with the chosen runtime and command. Create `.env` file and copy values from `.env.example`.
2. docker-compose build && docker-compose up
3. open localhost grafana on browser (localhost:3000) with username: admin, password: admin1
   - prepare graphs for metrics `nodejs_memory_usage_in_bytes` and `nodejs_cpu_usage_in_percentage`
4. [install k6](https://k6.io/docs/get-started/installation/) and run load test
   - k6 run src/http-request-load-test.js
   - k6 run src/websocket-load-test.js
5. View metrics on grafana
6. docker-compose down
