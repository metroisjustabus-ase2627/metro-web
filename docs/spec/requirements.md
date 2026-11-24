# MetroIsJustABus – Requirements Specification v2

Version 2 · 9 November 2026 · Status: draft. Team decisions D-01 to D-08 (section 8) still need team confirmation.

## 1. Purpose and method

This is version 2 of the system-level requirements. It answers the Milestone 1 feedback: requirements are corrected and reclassified, each one is testable and traceable, scope limits are explicit, and the specification follows a defined framework.

**Framework used**

- **Quality of each requirement** (ISO/IEC/IEEE 29148, lecture T6): necessary, unambiguous, singular (one need per ID), verifiable, feasible, traceable.
- **Wording** (EARS patterns): *The system shall…* (always), *When \<event>, the system shall…*, *While \<state>, the system shall…*, *If \<unwanted case>, then the system shall…*, *Where \<option>, the system shall…*.
- **Classification**: Functional requirements (FR) = behaviour a user or component can observe. Quality requirements (NFR) = how well the system behaves, always with a measurable criterion. Constraints (CON) = fixed decisions imposed by the statement on architecture, delivery or process. In v1 these three were mixed in one NFR list.
- **Origin of each requirement** (PL6): **S** = stated in the project statement, **D** = derived (a necessary consequence of a stated requirement), **T** = team decision (listed in section 8, with its reason).
- **Priority** (MoSCoW): Must / Should / Could.
- **Verification**: every requirement has an observable acceptance outcome or a verification method (Test, Inspection, Demonstration, Analysis).

**Main changes from v1**

- Reclassified as functional: v1 NFR07 (no duplicate ticket, validation or notification), v1 NFR19 (historical information) and the notification part of v1 NFR02.
- Split the remaining v1 NFRs into measurable quality requirements and constraints.
- Added missing requirements: login and roles, ticket states, validation rejection reasons, disruption lifecycle, notifications caused by staff changes, history, security, performance.
- Merged duplicates (v1 FR06 + FR07, FR03 + FR17).
- Replaced line-number references with source IDs and short quotations (section 2).
- Added out-of-scope items (section 7) and assumptions, decisions and open questions (section 8).

**How it is used (SDD)**: this document is the shared technical specification. It lives in the repositories as `docs/spec/requirements.md`, versioned with the code. Each feature in `.ai/sdd/specs/<feature>/` refines its requirements with full Given/When/Then scenarios, design and tasks, and references these IDs instead of repeating them. When code and specification disagree, the code changes (lecture T4B).

## 2. Sources

Every requirement points to one or more source IDs below, which refer to the project statement v1.1 (2026-11-17; v1.0 2026-09-29). This replaces the v1 line numbers, which depended on how the PDF was counted.

| ID | Statement section | Key passage (short quote) |
| --- | --- | --- |
| SRC-01 | Technical Description §1 (network) | "A line defines an ordered sequence of stops"; schedules "may vary according to the day of the week" |
| SRC-02 | Technical Description §2 (consultation) | "consult the network, lines, stops, schedules, and scheduled trips"; "consider known changes to normal operation" |
| SRC-03 | Technical Description §3 (disruptions) | trips "delayed, cancelled, diverted"; may affect "a complete line, individual stops, particular trips, or periods" |
| SRC-04 | Technical Description §4 (tickets) | types differ in "price, period of validity, conditions of use, or number of permitted journeys"; "acquire tickets and consult the tickets associated with their account" |
| SRC-05 | Technical Description §5 (validation) | "record successful validations"; validity depends on "type, current state, previous validations, and the time"; staff "obtain information about ticket usage" |
| SRC-06 | Technical Description §6 (occupancy) | "occupancy of scheduled trips and their available capacity"; to staff and "where appropriate, to passengers" |
| SRC-07 | Technical Description §7 (accounts, subscriptions) | "determine which passengers are affected and notify them"; "control their subscriptions and notification preferences" |
| SRC-08 | Technical Description §8 (operational staff) | maintain network and schedules, manage ticket information and disruptions; changes "may result in notifications" |
| SRC-09 | Technical Description §9 (lifecycles) | "Historical information may be relevant for understanding previous system activity" |
| SRC-10 | Technical Description §10 (failures) | failures should not make "the entire system unavailable"; no "same ticket… same validation… same notification multiple times" |
| SRC-11 | Application and Architecture | distributed, multi-component; minimum set of components; "A single backend… does not satisfy" |
| SRC-12 | Communication and Integration | synchronous and asynchronous communication, failures, retries, duplicates, consistency |
| SRC-13 | Testing and Verification | unit, integration, system, interface, static analysis, failure and recovery tests |
| SRC-14 | CI/CDE/CD | build, test, quality checks, versioned artifacts, gates, traceability |
| SRC-15 | Deployment and Infrastructure | dev and prod environments, self-hosted runner, containers, deployment strategy, secrets, persistent data |
| SRC-16 | AI-Assisted and Agentic Engineering; Final Delivery | AI used across the lifecycle; evidence of delegated tasks, human intervention, validation and rework |
| SRC-17 | Project Phases – Deployment and Monitoring | "monitoring and observability mechanisms" to detect and diagnose failures |
| FB-M1 | Milestone 1 feedback (professor) | log the prompts; correct FR and NFR; state what is out of scope; deeper specification framework |

## 3. Actors and glossary

There are four actors: three human and one simulated device. The glossary fixes the meaning of each domain term, so people and agents use the same words in specs, code and tests.

| Actor | Description | Origin |
| --- | --- | --- |
| Visitor | Anyone using the web app without logging in. Can only consult network, schedules and disruptions. | T (D-04) |
| Passenger | Registered user. Acquires and holds tickets, subscribes, receives notifications. | S (SRC-07) |
| Operational staff | Maintains network, schedules, ticket types and disruptions; consults usage, occupancy and history. | S (SRC-08) |
| Validator (simulated) | Software actor standing in for the on-board device. Submits a ticket ID, a trip ID and a time for validation. | T (D-02) |

| Term | Definition |
| --- | --- |
| Stop | A place where buses pick up and drop off passengers. |
| Line | A named, ordered sequence of at least two stops. |
| Service day type | The set of days on which a schedule applies (for example weekdays, Saturday, Sunday and holidays). |
| Schedule | The planned trips of a line for a service day type. |
| Scheduled trip | One planned run of a line on a given date, with an expected time at each stop. |
| Disruption | A recorded deviation from normal operation (delay, cancellation, diversion, other) with a scope (line, stop, trip or period) and a time interval. |
| Ticket type | A product on sale, defined by price, validity period, conditions of use and number of permitted journeys (a number, or unlimited). |
| Ticket | One ticket type issued to one passenger account. It is always in one state: Active, Exhausted or Expired. |
| Validation | An accepted use of a ticket on a scheduled trip at a given time. Rejected attempts are logged, but they are not validations. |
| Capacity | The maximum number of passengers for a scheduled trip. |
| Occupancy | The number of accepted validations on a scheduled trip (boardings). |
| Subscription | A passenger's interest in a line, a stop or a scheduled trip. |
| Notification | A message telling one passenger about one relevant change, delivered through the channels the passenger chose. |

## 4. Functional requirements

There are 37 functional requirements, grouped into 9 feature areas. Each area maps to one or more SDD feature folders. Items marked ★ were moved here from v1 NFRs.

### 4.1 Network and schedule consultation (NET)

| ID | Requirement | Source | Origin | Pri | Acceptance outcome |
| --- | --- | --- | --- | --- | --- |
| FR-NET-01 | The system shall let any user, with or without an account, list the lines and, for each line, its stops in order. | SRC-02, SRC-01 | S + T (D-04) | Must | The stops of a line are returned in the configured order, without authentication. |
| FR-NET-02 | When a user selects a line or a stop and a date, the system shall show the scheduled trips running on that date and the expected time at each stop. | SRC-01, SRC-02 | S | Must | For a weekday and a Sunday, the results match the schedules of the two service day types. |
| FR-NET-03 | The system shall let any user consult a scheduled trip with its expected time at every stop. | SRC-02 | S | Must | The trip detail lists all stops of the line with times in increasing order. |
| FR-NET-04 | When an active disruption affects the line, stop, trip or period being consulted, the system shall show it with the result: cancelled trips marked, delayed times adjusted, skipped stops marked. | SRC-02, SRC-03 | S | Must | After staff cancel trip T, the next consultation of T or its line shows T as cancelled. |

### 4.2 Network and schedule maintenance (OPS)

| ID | Requirement | Source | Origin | Pri | Acceptance outcome |
| --- | --- | --- | --- | --- | --- |
| FR-OPS-01 | The system shall let staff create, edit and deactivate stops and lines, a line being an ordered sequence of stops. | SRC-08, SRC-01 | S | Must | A new line with 5 stops is visible to visitors in that order. |
| FR-OPS-02 | The system shall let staff define, for each line and service day type, the trips and the expected time at each stop. | SRC-08, SRC-01 | S | Must | The schedule entered for Saturdays appears only on Saturday dates. |
| FR-OPS-03 | If staff submit a line with fewer than two stops, or a trip whose times do not increase along the line, then the system shall reject it and state the reason. | SRC-01 | D | Should | The invalid input returns a validation error naming the field; nothing is saved. |
| FR-OPS-04 | When staff change a line, stop or schedule that affects future trips, the system shall produce a change event that can trigger notifications (FR-SUB-04). | SRC-08 | S | Must | Changing a trip time emits one event with the affected line, stops and trips. |

### 4.3 Disruptions (DIS)

| ID | Requirement | Source | Origin | Pri | Acceptance outcome |
| --- | --- | --- | --- | --- | --- |
| FR-DIS-01 | The system shall let staff register a disruption with a type (delay, cancellation, diversion, other), a scope (line, stop, trip, or a period on a line), a time interval and a passenger-facing description. | SRC-03, SRC-08 | S | Must | Each of the 4 scope kinds can be saved and is returned with its scope. |
| FR-DIS-02 | The system shall let staff update and close a disruption. A closed disruption is no longer shown to passengers but stays in history. | SRC-03, SRC-09 | S + D | Must | After closing, consultation no longer shows it; the staff history still lists it. |
| FR-DIS-03 | Where the disruption type is delay, the system shall require the delay in minutes and apply it to the expected times shown (FR-NET-04). | SRC-03 | D | Should | A 10-minute delay on trip T shows every remaining stop of T 10 minutes later. |

### 4.4 Ticket types and acquisition (TKT)

| ID | Requirement | Source | Origin | Pri | Acceptance outcome |
| --- | --- | --- | --- | --- | --- |
| FR-TKT-01 | The system shall let staff create, edit and withdraw ticket types, each with price, validity period, conditions of use and number of permitted journeys (a number, or unlimited). | SRC-04, SRC-08 | S | Must | A withdrawn type is no longer on sale; tickets already issued are unaffected. |
| FR-TKT-02 | The system shall show logged-in passengers the ticket types currently on sale, with their attributes. | SRC-04 | D | Must | Only types on sale are listed. |
| FR-TKT-03 | When a logged-in passenger acquires a ticket type, the system shall issue one ticket linked to that account after a simulated payment. | SRC-04 | S + T (D-01) | Must | The new ticket appears in the passenger's account with state Active. |
| FR-TKT-04 ★ | If the same acquisition request is received more than once (retry, double click, timeout), then the system shall issue only one ticket and return that same ticket for every repeat. | SRC-10 | S | Must | Sending the same request 3 times with the same request ID creates 1 ticket. |
| FR-TKT-05 | The system shall let a passenger consult the tickets on their account, with type, state, remaining journeys and end of validity. | SRC-04 | S | Must | The list shows exactly the passenger's tickets with correct remaining journeys. |
| FR-TKT-06 | The system shall keep each ticket in exactly one state: Active, Exhausted (no journeys left) or Expired (validity period ended). | SRC-05 | D | Must | Using the last journey moves the ticket to Exhausted; passing the end of validity moves it to Expired. |

### 4.5 Ticket validation (VAL)

| ID | Requirement | Source | Origin | Pri | Acceptance outcome |
| --- | --- | --- | --- | --- | --- |
| FR-VAL-01 | When the validator submits a ticket ID, a trip ID and a time, the system shall accept the validation only if the ticket is Active, the time is within its validity period, it has journeys left, and the trip is not cancelled. | SRC-05 | S + T (D-02) | Must | All 4 conditions are covered by tests, each with one passing and one failing case. |
| FR-VAL-02 | When a validation is accepted, the system shall record it (ticket, trip, time) and consume one journey where the ticket type has a limited number. | SRC-05 | S | Must | A 10-journey ticket shows 9 left and one recorded validation. |
| FR-VAL-03 | If a validation is rejected, then the system shall return the reason (unknown ticket, expired, exhausted, not yet valid, trip cancelled) and record no validation. | SRC-05 | D | Must | Every reason is returned in a machine-readable code; the count of validations does not change. |
| FR-VAL-04 ★ | If the same ticket is validated more than once on the same trip, then the system shall keep one validation and consume at most one journey. | SRC-10 | S + T (D-03) | Must | 3 identical submissions give 1 validation and 1 journey consumed. |

### 4.6 Occupancy and capacity (OCC)

| ID | Requirement | Source | Origin | Pri | Acceptance outcome |
| --- | --- | --- | --- | --- | --- |
| FR-OCC-01 | When a validation is accepted on a trip, the system shall increase the occupancy of that trip by one. | SRC-06 | S | Must | After 3 accepted validations on trip T, occupancy of T is 3. |
| FR-OCC-02 | The system shall show staff, for each scheduled trip, its capacity, occupancy and available capacity. | SRC-06 | S | Must | Available capacity = capacity − occupancy, never negative. |
| FR-OCC-03 | The system shall show passengers the occupancy of a trip as a level (Low, Medium, High, Full), not as an exact count. | SRC-06 | S + T (D-05) | Should | At 0–49 %, 50–79 %, 80–99 % and 100 % of capacity, the level shown is Low, Medium, High and Full respectively. |
| FR-OCC-04 | The system shall let staff set the capacity of a line's trips, with an override per trip. | SRC-06 | D | Should | A trip override takes precedence over the line default. |

### 4.7 Accounts and access (ACC)

| ID | Requirement | Source | Origin | Pri | Acceptance outcome |
| --- | --- | --- | --- | --- | --- |
| FR-ACC-01 | The system shall let a visitor create a passenger account with e-mail and password. | SRC-07 | S | Must | A second account with the same e-mail is refused. |
| FR-ACC-02 | The system shall authenticate users and give each one a role, Passenger or Staff. Staff accounts are created only by staff. | SRC-07, SRC-08 | D + T (D-06) | Must | Self-registration always produces the Passenger role. |
| FR-ACC-03 | The system shall let a passenger see and change only their own tickets, subscriptions and notifications. | SRC-04, SRC-07 | D | Must | Requesting another passenger's ticket returns "not found" or "forbidden". |

### 4.8 Subscriptions and notifications (SUB)

| ID | Requirement | Source | Origin | Pri | Acceptance outcome |
| --- | --- | --- | --- | --- | --- |
| FR-SUB-01 | The system shall let a passenger subscribe to a line, a stop or a scheduled trip. | SRC-07 | S | Must | The subscription appears in the passenger's list. |
| FR-SUB-02 | The system shall let a passenger list and remove their subscriptions. | SRC-07 | S | Must | After removal, no further notifications arrive for that item. |
| FR-SUB-03 | The system shall let a passenger choose notification channels (e-mail, in-app) and switch notifications off per subscription. | SRC-07 | S + T (D-07) | Must | With e-mail off, only the in-app notification is created. |
| FR-SUB-04 ★ | When a disruption is registered, changed or closed, or a network or schedule change occurs (FR-OPS-04), the system shall determine the subscribed passengers affected and notify each of them through their chosen channels. | SRC-07, SRC-08 | S | Must | A disruption on line L notifies subscribers of L, of its affected stops and of its affected trips, and nobody else. |
| FR-SUB-05 | The system shall let a passenger read their notifications in the web app. | SRC-07 | T (D-07) | Should | Notifications are listed newest first and can be marked as read. |
| FR-SUB-06 ★ | If the same change is delivered to the notification component more than once, then the system shall notify each affected passenger at most once for that change. | SRC-10 | S | Must | Re-publishing the same event creates no new notification. |

### 4.9 History and reporting (HIS)

| ID | Requirement | Source | Origin | Pri | Acceptance outcome |
| --- | --- | --- | --- | --- | --- |
| FR-HIS-01 | The system shall let staff consult ticket usage and validation activity for a period, filterable by line, trip and ticket type, including accepted and rejected counts. | SRC-05 | S | Must | Totals match the validations recorded in that period. |
| FR-HIS-02 ★ | The system shall keep past disruptions, issued tickets, validations and sent notifications, and let staff consult them by period. | SRC-09 | S | Must | A disruption closed last month is still listed for last month. |
| FR-HIS-03 ★ | When a schedule changes, the system shall keep the previous version for past dates, so that past trips and validations still refer to the schedule in force at the time. | SRC-09 | D | Should | Changing a schedule today does not alter yesterday's trips. |

### 4.10 Key acceptance scenarios

These scenarios cover the requirements most exposed to failures and duplicates. The SDD feature specs add the rest.

```gherkin
Scenario: Duplicate validation on the same trip (FR-VAL-02, FR-VAL-04, FR-OCC-01)
  Given an Active ticket with 10 journeys left
  And scheduled trip T with occupancy 0
  When the validator submits the ticket for trip T three times
  Then exactly 1 validation is recorded
  And the ticket has 9 journeys left
  And the occupancy of T is 1

Scenario: Rejected validation (FR-VAL-03)
  Given a ticket whose validity ended yesterday
  When the validator submits it for trip T
  Then the response reason is "expired"
  And no validation is recorded and the occupancy of T is unchanged

Scenario: Retried acquisition (FR-TKT-03, FR-TKT-04)
  Given a logged-in passenger
  When the same acquisition request is sent twice because the first response timed out
  Then the passenger has 1 new ticket
  And both responses contain the same ticket ID

Scenario: Disruption notifies only affected subscribers (FR-SUB-04, FR-SUB-06)
  Given passenger A subscribed to line L and passenger B subscribed to line M
  When staff register a cancellation of a trip of line L
  Then A receives 1 notification and B receives none
  And if the same event is delivered again, A still has 1 notification
```

## 5. Quality requirements (NFR)

There are 15 quality requirements. Each one has a measurable criterion and a verification method. Thresholds marked T are team targets, because the statement gives none (decision D-08).

| ID | Quality | Requirement | Source | Origin | Pri | Verification |
| --- | --- | --- | --- | --- | --- | --- |
| NFR-AV-01 | Availability (fault isolation) | While the notification component or the message broker is unavailable, the system shall keep serving consultation, acquisition and validation with normal responses. | SRC-10 | S | Must | System test: stop the containers, run the consultation, acquisition and validation suite; all tests pass. |
| NFR-AV-02 | Availability (degradation) | If a supporting component is unavailable, then the web app shall show an error only for the function that depends on it. | SRC-10 | D | Should | Demonstration with the component stopped. |
| NFR-REL-01 | Reliability (timeouts) | Every synchronous call between components shall have a timeout of at most 5 s and at most 3 retries, and shall end with a defined error, never hang. | SRC-12 | S + T | Must | Integration test with a delayed dependency: the response arrives in ≤ 20 s with a defined error code. |
| NFR-REL-02 | Reliability (duplicates) | Messages between components shall be delivered at least once and processed idempotently, using a unique message ID checked by the consumer. | SRC-10, SRC-12 | S | Must | Integration test: the same message published twice produces one effect. |
| NFR-REL-03 | Reliability (no loss) | If the notification component is down when events are published, then on restart it shall process every pending event. | SRC-10 | D | Must | Failure-and-recovery test: 10 events during the outage give 10 processed events after restart. |
| NFR-CON-01 | Consistency | When an operation changes core data and must reach another component, the data change and the outgoing event shall be committed atomically, and other components shall converge eventually. The mechanism is documented and justified in the design. | SRC-12 | S | Must | Test: a failure between commit and publish loses neither the change nor the event. Inspection of the design decision record. |
| NFR-SEC-01 | Security (credentials) | Passwords shall be stored only as salted hashes from an adaptive algorithm. | SRC-07 | D | Must | Inspection and unit test. |
| NFR-SEC-02 | Security (authorization) | Every staff operation shall require the Staff role. A Passenger or anonymous call shall be refused. | SRC-08 | D | Must | Automated test of every staff endpoint with a passenger token returns 403. |
| NFR-SEC-03 | Security (transport) | Production traffic from browsers shall use HTTPS. | SRC-15 | T | Should | Inspection of the production configuration. |
| NFR-PERF-01 | Performance (consultation) | With 50 concurrent users in the production environment, consultation responses shall have a 95th-percentile latency of at most 500 ms. | — | T | Should | Load test (k6 or similar) report attached to a pipeline run. |
| NFR-PERF-02 | Performance (notification delay) | With all components up, 95 % of notifications shall be created within 60 s of the change that caused them. | SRC-07 | T | Should | System test that measures the time from event to notification. |
| NFR-OBS-01 | Observability (health) | Every component shall expose a health endpoint reporting its own state and that of its dependencies. | SRC-15, SRC-17 | D | Must | Used by the deployment validation gate (CON-CI-04). |
| NFR-OBS-02 | Observability (tracing) | Every component shall write structured logs with a correlation ID passed through HTTP calls and messages, so one user action can be followed across components. | SRC-17 | D | Must | Demonstration: one validation is traced in the logs of all components it touches. |
| NFR-OBS-03 | Observability (metrics) | The production environment shall collect request rate, error rate, latency and queue length, show them on a dashboard, and have at least one alert rule. | SRC-17 | S + T | Must | Inspection of the dashboard and of an alert triggered in a test. |
| NFR-DATA-01 | Data durability and retention | Persistent data shall survive container restarts and redeployments. Historical records (FR-HIS-02) shall not be purged during the project. | SRC-09, SRC-15 | S + T | Must | Redeploy test: the data is identical before and after. |

## 6. Constraints (CON)

These 19 items are not behaviours or qualities of the product. They are decisions the statement imposes on architecture, delivery and process, and they are verified mostly by inspection and by the pipeline. In v1 they were listed as NFRs.

### 6.1 Architecture

| ID | Constraint | Source | Verification |
| --- | --- | --- | --- |
| CON-ARC-01 | The system shall be distributed and multi-component. A single backend exposing all functions through one REST API is not acceptable. | SRC-11 | Inspection of the deployment |
| CON-ARC-02 | The system shall include at least: a passenger web app, a core backend, one or more independently deployable supporting services, and notifications behind an independent application boundary. | SRC-11 | Inspection: separate images and containers |
| CON-ARC-03 | Components shall communicate both synchronously (APIs) and asynchronously (events or messages). | SRC-12 | Inspection of the interface specifications |
| CON-ARC-04 | Interfaces and exchanged data shall be explicitly defined and versioned: OpenAPI for HTTP APIs, a schema for each event. | SRC-11, SRC-12 | Contract tests in the pipeline |
| CON-ARC-05 | The choice of communication mechanisms, protocols and data formats shall be justified in decision records. | SRC-12 | Inspection of the decision records |

### 6.2 Infrastructure and deployment

| ID | Constraint | Source | Verification |
| --- | --- | --- | --- |
| CON-DEP-01 | Every application component and supporting service shall run in a container. | SRC-15 | Inspection |
| CON-DEP-02 | Development and production environments shall be separate, and their setup reproducible from version-controlled configuration. | SRC-15 | Recreate an environment from the repository |
| CON-DEP-03 | The development environment shall host a self-hosted CI/CD runner and run the integration and system tests. | SRC-15 | Pipeline logs show the self-hosted runner |
| CON-DEP-04 | Production shall use a defined and justified deployment strategy (rolling, blue-green, canary, shadow or A/B). | SRC-15 | Demonstration of one release |
| CON-DEP-05 | Configuration, secrets, persistent data, networks and service dependencies shall be managed in version-controlled deployment configuration. Secrets are never committed. | SRC-15 | Inspection and an automated secret scan |

### 6.3 CI/CDE/CD pipeline

| ID | Constraint | Source | Verification |
| --- | --- | --- | --- |
| CON-CI-01 | The pipeline shall automate build, tests, static analysis and quality checks, integration and system validation, and deployment to development and production. | SRC-14 | Pipeline definition and runs |
| CON-CI-02 | Every successful build shall produce versioned deployable artifacts, traceable from source commit to artifact to deployed version. | SRC-14 | Image tag = commit SHA; the deployed version is visible on the health endpoint |
| CON-CI-03 | Automated validation gates shall block promotion to production when tests, quality checks or system validation fail. | SRC-14 | A failing run is not deployed |
| CON-CI-04 | Each deployment shall be validated (health and smoke tests), and a failed deployment shall be rolled back automatically. | SRC-14, SRC-15 | Demonstration with a broken release |

### 6.4 Testing

| ID | Constraint | Source | Verification |
| --- | --- | --- | --- |
| CON-TST-01 | The project shall include automated unit, integration, system/end-to-end, interface (contract) and failure-and-recovery tests, plus static analysis, and further techniques where an NFR needs them (load tests for NFR-PERF, security scans for NFR-SEC). | SRC-13 | Pipeline reports |

### 6.5 Engineering process and AI use

| ID | Constraint | Source | Verification |
| --- | --- | --- | --- |
| CON-PRC-01 | LLMs and agents shall be used across the lifecycle. Their outputs are treated as unverified until a test or a person accepts them. | SRC-16 | Review records |
| CON-PRC-02 | Every significant AI interaction shall be logged in the repository: tool, model, prompt, output or changed files, and the human decision (accepted, modified, rejected). | SRC-16, FB-M1 | `.ai/logs/` and `summary.md` |
| CON-PRC-03 | Traceability shall be kept from source to requirement, design element, task, test and artifact. | SRC-14, SRC-16 | Traceability matrix per feature (`review.md`) |
| CON-PRC-04 | Specifications shall follow the team's SDD workflow: steering files plus one folder per feature (requirements, design, tasks, review) in the repository. The specification prevails over the code. | FB-M1 | Inspection of `.ai/` |

## 7. Out of scope

The items below will not be built. Agents must not implement them, and any requirement that seems to need one is first raised as an open question. Each exclusion either is not asked for by the statement or replaces a real-world dependency with a simulation.

| Not included | What we do instead | Related |
| --- | --- | --- |
| Real payment processing (cards, payment gateways, invoices) | Simulated payment that always succeeds | FR-TKT-03, D-01 |
| Refunds, ticket transfer between accounts, discounts and concession profiles | Ticket types defined only by the four attributes in the statement | FR-TKT-01 |
| Fare calculation by zone or distance | A fixed price per ticket type | FR-TKT-01 |
| Physical validators, NFC cards, QR scanning hardware | A simulated validator (API plus a simple screen) | FR-VAL-01, D-02 |
| Real-time vehicle location (GPS), automatic delay detection, arrival predictions | Delays and cancellations entered by staff as disruptions | FR-DIS-01 |
| Journey planning (routes between two stops, transfers) | Consultation of lines, stops and trips only | FR-NET-01..04 |
| Counting passengers who leave the bus; occupancy sensors | Occupancy = accepted validations (boardings) | FR-OCC-01, A-02 |
| Fleet, vehicle and driver management; staff rosters | Capacity is set per line or trip | FR-OCC-04 |
| Native mobile apps; SMS and mobile push notifications | Responsive web app; e-mail and in-app notifications | FR-SUB-03, D-07 |
| Social login or external identity providers; staff self-registration | E-mail and password accounts; staff created by staff | FR-ACC-01, FR-ACC-02 |
| Several operators or cities; multilingual interface | One network; English interface | — |
| Full GDPR process (consent management, data export or erasure on request) | Only the data needed for the functions; no real personal data in tests | NFR-SEC-01 |
| Load beyond the NFR-PERF targets; multi-region high availability | Single production host; targets in section 5 | NFR-PERF-01 |

## 8. Assumptions, team decisions and open questions

Where the statement is silent, the team decides and gives a reason. These are proposals until the team confirms them. Open questions block only the requirements listed next to them.

### 8.1 Team decisions

| ID | Decision | Reason | Affects |
| --- | --- | --- | --- |
| D-01 | Ticket payment is simulated and always succeeds. | The statement asks for acquisition, not payment; a real gateway adds risk and no learning value. | FR-TKT-03 |
| D-02 | Validation is submitted by a simulated validator with ticket ID, trip ID and time. | The statement does not say how validation happens, and occupancy needs to know the trip (SRC-06). | FR-VAL-01, FR-OCC-01 |
| D-03 | The same ticket on the same trip counts as one validation. | Duplicates must not create repeated validations (SRC-10), and a passenger boards a trip only once. | FR-VAL-04 |
| D-04 | Consultation of network, schedules and disruptions needs no login. | It is public timetable information; the statement does not require an account for it. | FR-NET-01..04 |
| D-05 | Passengers see occupancy as a level (Low below 50 %, Medium below 80 %, High below 100 %, Full at 100 %); staff see exact numbers. | "Where appropriate" is not defined; a level is enough to choose a trip. | FR-OCC-03 |
| D-06 | Two roles, Passenger and Staff, in one web app with role-based screens. | The statement names two user groups; this matches the JWT authentication already in metro-core. | FR-ACC-02 |
| D-07 | Notification channels are e-mail and in-app. | The statement names no channel; e-mail support already exists in metro-core, and in-app needs no external provider. | FR-SUB-03, FR-SUB-05 |
| D-08 | Timeouts, retries, latency and notification delay use team targets: 5 s, 3 retries, 500 ms p95, 60 s. | The statement gives no numbers, and NFRs without numbers cannot be verified. | NFR-REL-01, NFR-PERF-01, NFR-PERF-02 |

### 8.2 Assumptions

| ID | Assumption | Affects |
| --- | --- | --- |
| A-01 | Service day types are weekdays, Saturday, and Sunday or holiday. | FR-NET-02, FR-OPS-02 |
| A-02 | No data exists on passengers leaving the bus, so occupancy counts boardings and is an upper bound of the people on board. | FR-OCC-01..03 |
| A-03 | One vehicle serves each trip, so capacity belongs to the trip. | FR-OCC-04 |
| A-04 | All times are in one time zone (Europe/Lisbon). | FR-NET-02, FR-VAL-01 |

### 8.3 Open questions

| ID | Question | Proposed answer | Blocks |
| --- | --- | --- | --- |
| Q-01 | Does a ticket's validity period start at acquisition or at first validation? | At first validation for time-based passes, at acquisition for journey-based tickets. | FR-VAL-01, FR-TKT-06 |
| Q-02 | Which component owns subscriptions and decides who is affected? The v1 document says the core manages subscriptions (§4.2) but that notifications chooses the recipients (§4.3). | Move subscriptions and preferences into the notification component; core events carry the affected line, stop and trip IDs. To be settled in the design. | FR-SUB-01..06, FR-OPS-04 |
| Q-03 | Should every disruption update send a notification? | Only creation, a delay change of 5 minutes or more, and closing. | FR-SUB-04 |
| Q-04 | Which future trips does a schedule change notify about? | Only trips in the next 7 days. | FR-OPS-04, FR-SUB-04 |

## 9. Traceability: v1 to v2, and requirements to features

Every v1 requirement survives in v2: 3 were reclassified as functional, 2 pairs were merged, and the rest were split, made measurable, or turned into constraints. The second table assigns each v2 requirement to an SDD feature folder.

| v1 ID | v2 ID(s) | Change |
| --- | --- | --- |
| FR01 | FR-NET-01, FR-NET-02, FR-NET-03 | Split; date and service day type added |
| FR02 | FR-NET-04, FR-DIS-03 | Made observable (cancelled, delayed, skipped) |
| FR03 + FR17 | FR-OCC-02, FR-OCC-03 | Merged; "when appropriate" decided (D-05) |
| FR04 | FR-TKT-02, FR-TKT-03 | Split; payment simulated (D-01) |
| FR05 | FR-TKT-05 | Fields to show added |
| FR06 + FR07 | FR-VAL-01, FR-VAL-02, FR-VAL-03 | Merged; acceptance conditions and rejection reasons explicit |
| FR08 | FR-OCC-01 | Unchanged in meaning |
| FR09 | FR-ACC-01, FR-ACC-02 | Login and roles added |
| FR10, FR11 | FR-SUB-01, FR-SUB-02, FR-SUB-03 | Channels and per-subscription switch defined (D-07) |
| FR12 | FR-SUB-04, FR-SUB-05 | Triggers and recipients made explicit |
| FR13 | FR-OPS-01, FR-OPS-02, FR-OPS-03 | Split; validation rules added |
| FR14 | FR-TKT-01 | Withdrawal added |
| FR15 | FR-DIS-01, FR-DIS-02 | Scopes, update and closing added |
| FR16 | FR-HIS-01 | Filters and counts added |
| NFR01–NFR04 | CON-ARC-01..05 | Reclassified as constraints |
| NFR02 (notification part) | FR-SUB-04 ★ | Reclassified as functional |
| NFR05 | NFR-AV-01, NFR-AV-02 | Made measurable |
| NFR06 | NFR-REL-01 | Numbers added (D-08) |
| NFR07 | FR-TKT-04 ★, FR-VAL-04 ★, FR-SUB-06 ★, NFR-REL-02 | Business rules reclassified as functional; the mechanism stays NFR |
| NFR08 | NFR-CON-01 | Made testable |
| NFR09–NFR13 | CON-DEP-01..05 | Reclassified as constraints |
| NFR14–NFR17 | CON-CI-01..04 | Reclassified as constraints |
| NFR18 | NFR-OBS-01, NFR-OBS-02, NFR-OBS-03 | Split and made measurable |
| NFR19 | FR-HIS-02 ★, FR-HIS-03 ★, NFR-DATA-01 | History reclassified as functional; retention stays NFR |
| NFR20 | CON-TST-01 | Reclassified as a constraint |
| — | FR-ACC-03, FR-TKT-06, FR-OPS-04, FR-OCC-04, NFR-REL-03, NFR-SEC-01..03, NFR-PERF-01..02, CON-PRC-01..04 | New |

| SDD feature folder (`.ai/sdd/specs/`) | Requirements | Suggested order |
| --- | --- | --- |
| `accounts-access` | FR-ACC-01..03, NFR-SEC-01..02 | 1 (largely in place in metro-core) |
| `network-maintenance` | FR-OPS-01..03, FR-OCC-04 | 2 |
| `network-consultation` | FR-NET-01..03 | 3 |
| `disruptions` | FR-DIS-01..03, FR-NET-04, FR-OPS-04 | 4 |
| `tickets` | FR-TKT-01..06 | 5 |
| `ticket-validation-occupancy` | FR-VAL-01..04, FR-OCC-01..03 | 6 (good PL6 candidate: rich rules, duplicates, cross-component) |
| `subscriptions-notifications` | FR-SUB-01..06, NFR-AV-01, NFR-REL-02..03, NFR-CON-01, NFR-PERF-02 | 7 (resolve Q-02 first) |
| `history-reporting` | FR-HIS-01..03, NFR-DATA-01 | 8 |
| Cross-cutting (steering and pipeline) | NFR-OBS-*, NFR-PERF-01, NFR-REL-01, NFR-SEC-03, all CON-* | Milestone 2 onward |
