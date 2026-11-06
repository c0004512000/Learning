# Verified technical baseline (2026-11-06)

The following claims were checked against vendor documentation. Source URLs remain in RESOURCES.md so Lessons may cite them directly.

1. Community Build analyzes the main branch. Native multi-branch analysis and PR analysis are not included. Source: official [Analysis overview](https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/analysis-overview), [GitHub integration](https://docs.sonarsource.com/sonarqube-community-build/devops-platform-integration/github-integration/introduction).
2. The scanner runs on the CI host and submits a report. SonarQube Server processes it, computes the Quality Gate and presents metrics/reports. Source: [Analysis overview](https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/analysis-overview).
3. The CI job can wait for the Quality Gate result and fail when the gate fails; waiting makes the job longer, with default timeout of 300 seconds per documentation. Source: [CI integration](https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/ci-integration/overview), [analysis parameters](https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/analysis-parameters/parameters-not-settable-in-ui).
4. SonarQube does not generate test coverage reports by itself; the test runner / coverage tool must generate them before Scanner imports them. Source: [Coverage overview](https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/test-coverage/overview).
5. H2 is suitable for limited tests but is not recommended for production; external supported DB such as PostgreSQL should be used for production. Source: [Database requirements](https://docs.sonarsource.com/sonarqube-community-build/server-installation/installing-the-database).
6. Scanner / CI analysis needs source checkout and metadata; full Git history can matter for SCM blame and new-code detection. Source: [Project analysis setup](https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/overview).
7. The vendor supplies an official GitHub Action for scanner invocation; Maven/Gradle projects should use their respective scanners. Source: [SonarQube Scan Action](https://github.com/SonarSource/sonarqube-scan-action).

## Limitations / unverified items

- Company's private workflow files were not located among connected accessible GitHub repository search results; organization-specific integration design remains an architectural hypothesis based on previously described CI patterns.
- No local Docker POC, authenticated SonarQube dashboard, GitHub Actions job, database deployment, TLS or backup test has been performed.
- The diagram is a simplified conceptual architecture, not a complete internal component/process layout.
