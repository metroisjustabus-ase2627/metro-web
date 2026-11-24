# MetroWeb

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.2.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## CI/CDE/CD and VM Deployment (Build Only Once)

GitHub Pages is **not** used. All components run as Docker containers on DEI Virtual Machines (`CON-DEP-01`, `CON-DEP-02`, `CON-DEP-03`, `ADR-004`):

1. **CI (`.github/workflows/ci.yml`)**: builds the production Angular bundle, runs Vitest unit tests with coverage, checks Prettier, strict TypeScript, `npm audit`, and Gitleaks secret scanning, and packages **one immutable Nginx image** (`ghcr.io/metroisjustabus-ase2627/metro-web:<commit-sha>`) with `APP_VERSION=<commit-sha>` exposed at `GET /health`.
2. **CD — Development VM (`.github/workflows/cd-dev.yml`)**: runs automatically after green CI on `main` via the DEI Dev VM self-hosted runner (`DEV_RUNNER`/`CI_RUNNER`) or SSH fallback, pulls the exact `<commit-sha>` image (`docker-compose.dev.yml`), validates `GET /health` (`Healthy` + exact SHA), and automatically rolls back on failure.
3. **CDE — Production VM (`.github/workflows/cd-prod.yml`)**: manual promotion (`workflow_dispatch` + GitHub `production` environment approval gate) of the same Dev-validated `<commit-sha>` image (`docker-compose.prod.yml`), with `/health` + SHA verification and automatic rollback.

To run the containerized Nginx build locally (exposing `GET /health` on port `4200`):

```bash
docker compose up --build -d
```

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
