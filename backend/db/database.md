# DB Schema - SkillShare Marketplace

## Account

| Field                   | Type            |
|-------------------------|-----------------|
| id                      | Int             |
| role                    | Audience (ENUM) |
| email                   | String          |
| password                | String          |
| mobileNumber            | String          |
| type                    | AudienceType (ENUM) |
| firstName               | String?         |
| lastName                | String?         |
| companyName             | String?         |
| companyPhoneNumber      | String?         |
| taxID                   | String?         |
| repFirstName            | String?         |
| repLastName             | String?         |
| addressStreetNumber     | String?         |
| addressStreetName       | String?         |
| addressCitySuburb       | String?         |
| addressState            | String?         |
| addressPostcode         | String?         |
| authToken               | String?         |

---

## Task

| Field                   | Type            |
|-------------------------|-----------------|
| id                      | Int             |
| accountId               | Int             |
| category                | TaskCategory (ENUM) |
| taskName                | String          |
| taskDescription         | String          |
| expectedStartDate       | DateTime        |
| expectedHours           | Int             |
| hourlyRate              | Float           |
| currency                | Currency (ENUM) |
| completed               | Boolean         |
| providerMarkedComplete  | Boolean         |
| userAcceptedCompletion  | Boolean?        |

---

## Skill

| Field                   | Type            |
|-------------------------|-----------------|
| id                      | Int             |
| accountId               | Int             |
| category                | TaskCategory    |
| experienceYears         | Int             |
| workNature              | WorkNature      |
| hourlyRate              | Float           |
| currency                | Currency        |

---

## Offer

| Field                   | Type            |
|-------------------------|-----------------|
| id                      | Int             |
| taskId                  | Int             |
| accountId               | Int             |
| status                  | OfferStatus     |

---

## TaskProgress

| Field                   | Type            |
|-------------------------|-----------------|
| id                      | Int             |
| taskId                  | Int             |
| accountId               | Int             |
| progressDescription     | String          |
| timestamp               | DateTime        |


# Database Interactions - SkillShare Marketplace

---

## Account Table

### Registration (`POST /register`)
- INSERT new `Account` row with full profile info
- SET `authToken`

### Login (`POST /login`)
- READ `Account` by email/password
- SET `authToken`

### Logout 
- UPDATE `authToken` to null

---

## Task Table

### Create Task (`POST /tasks`)
- INSERT new `Task` row
- Link to `Account.id` of USER

### Update Task (`PATCH /tasks/:id`)
- UPDATE Task fields (taskName, description, etc.)
- Only if `completed === false`

### Mark Task Complete (`POST /tasks/:id/complete`)
- UPDATE `completed = true` by USER who owns task

### Provider Mark Task Complete (`POST /tasks/:id/provider-complete`)
- UPDATE `providerMarkedComplete = true`, `userAcceptedCompletion = null`

### User Accept Completion (`POST /tasks/:id/accept-completion`)
- UPDATE `userAcceptedCompletion = true`, `completed = true`

### User Reject Completion (`POST /tasks/:id/reject-completion`)
- UPDATE `userAcceptedCompletion = false`, `providerMarkedComplete = false`

### Get Open Tasks (`GET /tasks/open`)
- SELECT Tasks where `completed = false`

### Get Provider Accepted Tasks (`GET /tasks/provider/accepted`)
- SELECT Tasks where PROVIDER has ACCEPTED offer

### Get User Posted Tasks (`GET /tasks/user/posted`)
- SELECT Tasks owned by USER

---

## Offer Table

### Make Offer (`POST /offers`)
- INSERT new Offer row (taskId, accountId)
- SET `status = PENDING`

### Accept Offer (`POST /offers/:id/accept`)
- UPDATE `status = ACCEPTED`

### Reject Offer (`POST /offers/:id/reject`)
- UPDATE `status = REJECTED`

### Get Offers on User Tasks (`GET /tasks/user/posted/offers`)
- SELECT Offers where `task.accountId === req.user.id`

### Get Offers Made By Provider (`GET /offers/made-by-me`)
- SELECT Offers where `accountId === req.user.id`

---

## Skill Table

### Create Skill (`POST /skills`)
- INSERT new `Skill` row
- Link to PROVIDER Account.id

### Update Skill (`PATCH /skills/:id`)
- UPDATE `Skill` row fields

### Get My Skills (`GET /skills/my`)
- SELECT Skills where `accountId === req.user.id`

---

## TaskProgress Table

### Add Progress (`POST /tasks/:id/progress`)
- INSERT new `TaskProgress` row with taskId, accountId (PROVIDER), progressDescription, timestamp

### View Progress (`GET /tasks/:id/progress`)
- SELECT TaskProgress rows for taskId
- Authorized for:
  - User who owns task
  - Provider with ACCEPTED Offer on task

---

# Summary of Table Usage

| Table          | Main APIs affecting table |
|----------------|--------------------------|
| Account        | /register, /login        |
| Task           | /tasks, /tasks/:id/...    |
| Offer          | /offers, /offers/:id/...  |
| Skill          | /skills, /skills/:id/...  |
| TaskProgress   | /tasks/:id/progress       |

---



