# Tests

| File                            | Test Description                                                                  | Restriction                                                                              |
| ------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **tests/account.test.js**       | Registers a new provider (COMPANY)                                                | Happy-path account registration (needed to get tokens)                                   |
|                                 | Logs in the provider                                                              | Happy-path login                                                                         |
|                                 | Registers a new user (INDIVIDUAL)                                                 | Happy-path account registration (needed to get tokens)                                   |
|                                 | Logs in the user                                                                  | Happy-path login                                                                         |
| **tests/account.error.test.js** | Rejects registration with missing individual fields                               | Ensures invalid user registrations fail (authentication guard)                           |
|                                 | Rejects registration with missing company fields                                  | Ensures invalid provider registrations fail (authentication guard)                       |
|                                 | Rejects login with invalid credentials                                            | Authentication guard                                                                     |
|                                 | Rejects `/api/me` without token                                                   | Authentication guard                                                                     |
| **tests/task.test.js**          | TASK: user can create a task                                                      | “Only user can post task”                                                                |
|                                 | TASK: provider is forbidden from creating a task                                  | “Only user can post task”                                                                |
|                                 | TASK: user can update their own task details                                      | “Only user can update posted task details”                                               |
|                                 | TASK: provider (non-owner) is forbidden from updating a user’s task               | “Only user can update posted task details”                                               |
|                                 | TASKS (user): user can list only their own posted tasks                           | “Users can only see their posted tasks”                                                  |
|                                 | TASKS (user): user is forbidden from listing another user’s posted tasks          | “Users can only see their posted tasks”                                                  |
| **tests/skill.test.js**         | SKILL: provider can create a skill                                                | “Only provider can post skill”                                                           |
|                                 | SKILL: user is forbidden from creating a skill                                    | “Only provider can post skill”                                                           |
| **tests/providerTasks.test.js** | TASKS (provider): provider can list only tasks they’ve been accepted for          | “Providers can only see tasks they’ve submitted an offer on and that were accepted”      |
|                                 | TASKS (provider): when none are accepted, returns empty list                      | “Providers can only see tasks they’ve submitted an offer on and that were accepted”      |
| **tests/progress.test.js**      | PROGRESS: provider with accepted offer can post progress                          | “Only provider who accepted the task can update task progress”                           |
|                                 | PROGRESS: provider whose offer is not accepted is forbidden from posting progress | “Only provider who accepted the task can update task progress”                           |
