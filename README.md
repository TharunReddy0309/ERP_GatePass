# Hostel Gatepass Management System

Built for: Indian Institute of Information Technology Sricity

Developed by: K. Raghuveer and B. Tharun Reddy

---

## Overview

The Hostel Gatepass Management System automates and streamlines the process of granting, approving, tracking, and auditing student movement in and out of hostel premises.

It replaces traditional paper-based gatepasses with a secure digital workflow that improves:
- Security
- Transparency
- Accountability
- Ease of management

---

## Stakeholders & Roles

### Student
- Raise gatepass requests
- View pass status
- Withdraw pending requests
- Show QR code at gate

### Parent
- Approve or reject Home Pass requests

### Caretaker
- Final approval/rejection of passes

### Warden
- Monitor violations
- Block/unblock students
- View audit logs

### Chief Warden
- Manage global hostel rules
- Override blocking restrictions

### Security
- Perform Outscan and Inscan using QR codes

---

## Key Features

### 1. Role-Based Access Control
- Secure authentication system
- Restricted access for each role
- No cross-role data visibility

### 2. Gatepass Workflow

#### Day Pass
- Instant caretaker approval
- QR generated immediately

#### Home Pass
- Student → Parent → Caretaker approval chain
- QR generated after final approval

### 3. QR Code Verification
- Unique QR generated for each pass
- Outscan during exit
- Inscan during return
- Expired QR becomes invalid automatically

### 4. Audit Logs
Every action is tracked:
- Submission
- Approval
- Rejection
- Withdrawal
- Outscan
- Inscan

### 5. Violation & Blocking System
- Late returns are automatically tracked
- Students exceeding limits get blocked
- Wardens can manually block/unblock students

### 6. Global Rule Management
Chief Warden can configure:
- Curfew timings
- Pass duration limits
- Advance notice rules
- Defaulter limits

---

## Non-Functional Requirements

- Fast QR scan response (< 2 seconds)
- Secure and tamper-proof QR codes
- Reliable approval workflow
- Supports concurrent users
- Easy-to-use interface for security staff

---

## Database Entities

- USERS
- STUDENTS
- HOSTEL_BLOCK
- PASSES
- PASS_ACTIONS
- BLOCKED

---

## Tech Stack

### Frontend
- React.js
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL / MySQL

### Authentication
- JWT Authentication

---

## UI / Figma Designs

Figma Design Link:
https://www.figma.com/design/qaRD994mBFCMEE7lZrisFc/Gatepass-UI

---

## Contributors

- K. Raghuveer
- B. Tharun Reddy
