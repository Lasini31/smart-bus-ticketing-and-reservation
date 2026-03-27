## ## Draft Content for CONTRIBUTING.md

# Contributing to SBTRS

Welcome to the **Smart Bus Ticketing and Reservation System** development team! [cite_start]To maintain our 99.9% availability goal, please follow these guidelines[cite: 35, 63].

### 📅 Project Timeline & Phases
[cite_start]All contributions must align with our current development phase[cite: 45]:
* [cite_start]**Phase 1 (Weeks 1-2):** Auth, ID Verification, and DB Schema[cite: 46].
* [cite_start]**Phase 2 (Weeks 3-5):** Prepaid Wallet and Pricing Logic[cite: 47, 48].
* [cite_start]**Phase 3 (Weeks 6-7):** Ticketing Engine and Refund Workflows[cite: 49].
* [cite_start]**Phase 4 (Week 8):** UAT and Deployment[cite: 50].

### 🌿 Branching Strategy
* **main**: Production-ready code only.
* **develop**: The integration branch for current features.
* **feature/**: Create branches from `develop` for specific tasks (e.g., `feature/wallet-logic`).

### 📝 Pull Request (PR) Process
1.  [cite_start]**Branch off `develop`** for your assigned module[cite: 44].
2.  [cite_start]**Self-Test**: Ensure your code meets the success metrics, like handling concurrent wallet transactions[cite: 57].
3.  **Submit PR**: Target the `develop` branch.
4.  **Review**: At least one other team member must approve the logic before merging.

### 🚫 Constraints to Remember
* [cite_start]**Web Only**: Do not submit native mobile code; the project is strictly a web application[cite: 15, 62].
* [cite_start]**No GPS**: Real-time tracking is out of scope for this phase[cite: 14, 62].
