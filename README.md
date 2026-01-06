# Medbill Workflow Automation Demo

## Overview
Webhook-driven workflow automation extracted from a Medbill-style claims system.

## Flow
1. Webhook → claim intake
2. Validation → ensure correct payload
3. Routing → AUTO_PROCESS or MANUAL_REVIEW
4. External Sync → simulate CRM / payer API
5. Analytics → track totals, auto/manual processing

## Why this matters
- Mirrors Zapier / Make.com workflows
- Handles retries, failures, and conditional routing
- Observability via analytics
- Demonstrates automation logic & backend skills

## Sample payload
```json
{
  "claimId": "CLM-1021",
  "patient": "Jane Doe",
  "amount": 1200,
  "payer": "InsuranceCo"
}
## Sample Analytics After Processing 10 Claims

| Metric | Value |
|--------|-------|
| Total Claims Processed | 10 |
| AUTO_PROCESS | 5 |
| MANUAL_REVIEW | 5 |

- This shows automated routing based on claim amount thresholds (>1000 → MANUAL_REVIEW)
- Demonstrates real-time workflow monitoring and analytics tracking
