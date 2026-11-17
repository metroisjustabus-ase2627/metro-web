# Final Delivery Plan (due December 11)

Work is split across 4 people (A, B, C, D). Each person owns a vertical slice (web + core) and part of the report. Requirement IDs refer to `docs/spec/requirements.md`.

## Person A: Network, operations and history
- **Features:** FR-NET-01 to 04 (lines, stops, timetables); FR-OPS-01 to 04 (line and schedule CRUD with validation); FR-HIS-01 to 03 (staff history, schedule versioning).
- **Tests:** unit and contract (OpenAPI) tests for these areas.
- **Report:** design and data model (5.2).

## Person B: Tickets, validation and occupancy
- **Features:** FR-TKT-01 to 06; FR-VAL-01 to 04 (idempotency in FR-TKT-04 and FR-VAL-04); FR-OCC-01 to 04; FR-ACC-01 to 03 (accounts, roles, security).
- **Tests:** the 4 cases of FR-VAL-01, idempotency, NFR-SEC.
- **Report:** testing and verification strategy (5.5), including validation of AI-generated code.

## Person C: Disruptions and notifications
- **Features:** FR-DIS-01 to 03; FR-SUB-01 to 06 (subscriptions, notifications, deduplication); independent notification component with broker and schema-defined events (CON-ARC-02 to 04).
- **Tests:** failure and recovery (NFR-AV-01, NFR-REL-02, NFR-REL-03); consistency (NFR-CON-01).
- **Report:** architecture, communication and decision records (5.2, CON-ARC-05).

## Person D: CI/CD, infrastructure and evidence
- **Pipeline (CON-CI-01 to 04):** dev deploy, self-hosted runner, integration and system tests, production gate, health and smoke tests, automatic rollback, commit to image to deploy traceability.
- **Infrastructure (CON-DEP-01 to 05):** dev and prod environments, deployment strategy, secrets, volumes, networks, monitoring and logs.
- **AI evidence:** CON-PRC-02 logs; metrics (effort, rework, CI failures).
- **Report:** CI/CD, deployment and operation (5.6); evidence and critical analysis (5.7).

## Shared deliverables
| Deliverable | Who | Due |
|---|---|---|
| Problem analysis and requirements (5.1) | A + D | Dec 3 |
| Traceability (5.3, CON-PRC-03) | each person for their FRs, D merges | Dec 5 |
| AI-assisted process (5.4) | D, input from all | Dec 6 |
| Team contributions (5.8) | each person their own | Dec 8 |
| 10-min video | all (A network/ops, B passenger/tickets, C failures/notifications, D proof of deployed version) | Dec 9 |
| System live in production, final repo review | D, reviewed by all | Dec 10 |
| Self and peer evaluation | each person | Dec 11 |
| Defense slot sign-up (Inforestudante) | one member | before Dec 11 |
| Individual defense preparation | all | before defense |

## Milestones
- **Nov 27:** base features per slice; dev and prod environments ready.
- **Dec 4:** full integration, failure scenarios, production deploy.
- **Dec 5 to 8:** report.
- **Dec 9 to 11:** video and wrap-up.

## Risks
- Person D is overloaded: consider moving production infrastructure (CON-DEP) to B, or having C help with system tests.
- Backend and notifications live in other repositories, so slices A, B and C span two repos.
