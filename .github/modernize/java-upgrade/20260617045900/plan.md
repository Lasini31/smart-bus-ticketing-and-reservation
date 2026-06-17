# Upgrade Plan: smart-bus-ticketing-and-reservation-auth (20260617045900)

- **Generated**: 2026-06-17 04:59 UTC
- **HEAD Branch**: N/A
- **HEAD Commit ID**: N/A

## Available Tools

**JDKs**
- JDK 17: not available (baseline will be skipped)
- JDK 21: **<TO_BE_INSTALLED>** (required by step 1)

**Build Tools**
- Maven Wrapper 3.9.14: available at `backend/busmanagement/mvnw` (compatible with Java 21; no upgrade required)
- System Maven: none installed; using wrapper only

## Guidelines

> Note: You can add any specific guidelines or constraints for the upgrade process here if needed, bullet points are preferred.

- Upgrade the backend Maven module runtime from Java 17 to Java 21 LTS
- Preserve Spring Boot 4.0.5 and existing application behavior
- Maintain the current Maven wrapper usage

## Options

- Working branch: appmod/java-upgrade-20260617045900
- Run tests before and after the upgrade: true

## Upgrade Goals

- Target Java runtime: 21 (latest LTS)

## Technology Stack

| Technology/Dependency | Current | Min Compatible | Why Incompatible |
| --------------------- | ------- | -------------- | ---------------- |
| Java | 17 | 21 | User requested latest LTS runtime upgrade |
| Spring Boot | 4.0.5 | 4.0.5 | Current version already supports Java 21 |
| Maven Wrapper | 3.9.14 | 3.9.0 | Compatible with Java 21; no upgrade required |

## Derived Upgrades

- Update Maven build target from Java 17 to Java 21 via `java.version` property.
- Keep Spring Boot 4.0.5 unchanged because it already supports Java 21.
- Use the existing Maven wrapper to avoid relying on a system Maven installation.
- Skip Spring Boot or dependency version upgrades unless test execution reveals an incompatibility.

## Impact Analysis

### Dependency Changes

| File | Dependency | Current | Action | Target | Reason |
|------|------------|---------|--------|--------|--------|
| backend/busmanagement/pom.xml | `<java.version>` property | 17 | upgrade | 21 | Align build target with requested Java 21 runtime |

### Source Code Changes

| File | Location | Current | Required Change | Reason |
|------|----------|---------|----------------|--------|
| None detected | N/A | N/A | N/A | Java version change is handled by Maven build configuration |

### Configuration Changes

| File | Property/Setting | Current | Required Change | Reason |
|------|------------------|---------|----------------|--------|
| None detected | N/A | N/A | N/A | No application config changes required for Java 21 only upgrade |

### CI/CD Changes

| File | Location | Current | Required Change |
|------|----------|---------|----------------|
| None detected | N/A | N/A | N/A |

### Risks & Warnings

- **Baseline skipped**: JDK 17 is not installed on this machine, so the baseline compile/test step will be skipped. Mitigation: run a full Java 21 test validation after the upgrade.
- **Runtime-only compatibility**: Static scan did not identify explicit JDK-internal API use, but hidden reflection or runtime behavior changes may surface during tests. Mitigation: execute `./mvnw clean test` with Java 21 and fix any failures.
- **No Git repository**: Version control is unavailable in this workspace, so changes will not be committed automatically.

## Upgrade Steps

- Step 1: Setup Java 21 Environment
  - **Rationale**: Install the required target JDK so the Maven wrapper can compile and test against Java 21.
  - **Changes to Make**: Install JDK 21 and verify the Maven wrapper is usable from `backend/busmanagement`.
  - **Verification**: `java -version` using JDK 21, `backend/busmanagement/mvnw -v`

- Step 2: Baseline Validation (Skipped if JDK 17 unavailable)
  - **Rationale**: Capture current build and test status with the base Java runtime before upgrading.
  - **Changes to Make**: None; verify current build if JDK 17 is available.
  - **Verification**: `backend/busmanagement/mvnw clean compile test-compile -q && backend/busmanagement/mvnw clean test -q`

- Step 3: Upgrade Maven Build Target to Java 21
  - **Rationale**: Change the build configuration to target the requested Java LTS runtime.
  - **Changes to Make**: Update `backend/busmanagement/pom.xml` `<java.version>` to `21`.
  - **Verification**: `backend/busmanagement/mvnw clean test-compile -q` using JDK 21

- Step 4: CVE Validation & Fix
  - **Rationale**: Scan direct Java dependencies for known vulnerabilities and remediate any reported CVEs.
  - **Changes to Make**: Run dependency CVE validation, update patched dependency versions as needed, verify compile.
  - **Verification**: `backend/busmanagement/mvnw clean test-compile -q` and `#appmod-validate-cves-for-java`

- Step 5: Final Validation
  - **Rationale**: Confirm the upgraded runtime build is correct and all tests pass on Java 21.
  - **Changes to Make**: Fix issues found during full test execution.
  - **Verification**: `backend/busmanagement/mvnw clean test -q` using JDK 21
