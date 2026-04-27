---
title: "People"
source: "api/index.html"
anchor: "people"
---
## People

People represent donors and contacts in the system. A person is automatically created when a donation is made with a new email address.

### GET /v2/people — List people

Returns people (donors/contacts) for the specified account. Requires authentication.

| Parameter | Description |
| --- | --- |
| account\_id required | Account identifier |
| keyword optional | Search by name or email |
| limit | Results per page (max 100) |
| offset | Pagination offset |

### GET /v2/people/:id — Get person

Retrieve a single person by unique identifier.

### POST /v2/people — Create person

Create a new person record. Can be used without authentication.

### GET /v2/people/exists — Check if person exists

Check if a person exists by email address. Public endpoint.

### GET /v2/people/tax\_receipt — Get tax receipt

Generate a tax receipt for a donor for a given period.
