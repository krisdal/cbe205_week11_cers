# CBE205 Week 11 — Campus Event Registration System

## Quick start

1. Create a local PostgreSQL database `cers_week11`. (see Appendix)
2. Run `psql -d cers_week11 -f database/schema.sql` and `psql -d cers_week11 -f database/seed.sql` (adjust connection flags as needed).
3. `cd backend && npm install && cp .env.example .env` then edit DATABASE_URL. Set `DATABASE_SSL=true` if your hosted PostgreSQL provider requires TLS; leave it `false` for a local database.
4. `npm test` (unit tests do not require PostgreSQL); `npm run dev`.
5. Run the frontend with Vite. It calls `http://localhost:3001` by default; set `VITE_API_BASE_URL` to your API origin (for example, `https://cbe205-week11-cers.onrender.com`) in the frontend build environment to override it.

## API

- GET `/api/events`
- GET `/api/events/E001`
- POST `/api/events/E001/registrations` (student identity is fixed server-side to `S001`)

## Instructor checkpoints

`baseline` (Week 10 conceptual implementation) → `architecture` → `unit-tests` → `tdd` → `postgresql` → `complete`. These are suggested teaching stages, not pre-existing Git tags.

## Important constraints

This is a teaching demonstration, not a production authentication system. No real SSO, SIS, email, cancellation, or organizer UI. Capacity checks are serialized by locking the event row inside the same transaction; uniqueness is also enforced by the database.

## React frontend

`cd frontend && npm install && npm run dev` then open the Vite URL shown in the terminal.

## Continuous integration

The repository has separate GitHub Actions workflows for the two applications:

- **Backend CI** runs the backend unit tests when backend files change.
- **Frontend CI** creates a production Vite build when frontend files change.

Both workflows run for pushes and pull requests that affect their application. They can also be run manually from the **Actions** tab on GitHub.

## Appendix (How to create a new database)

1. Install Postgres on your machine. https://www.postgresql.org/download/
2. Open the program and Start the server.
3. Open a new terminal and log in to psql shell with 'psql'
4. Enter the default user name/password, postgres/postgres (you may create a new user name from the Postgres Server app.)
5. Create a new database from the psql shell 'CREATE DATABASE cers_week11;' Don't forget to enter ; at the end of the SQL command.
6. Continue with the above instruction.

## Some command line for psql (you can Google)

'\l' to list all the database
'\c <database_name>' to use a certain database
'\dt' to list all the tables

## Note: You may want to access the database from pgAdmin

1. Open pgAdmin
2. Select default workspace on the left menu
3. In the object explorer, right click and select 'Create Server Group', name it 'local'
4. Right click the server group 'local' and select 'Register Server' Give it a name 'local' and set up the 'Connection'
   Hostname/address = 127.0.0.1
   Port = 5432
   Maintenance database = 'postgres'
   Username = 'postgres'
   Password = 'postgres'

   Click 'Save'

5. You'll see the 'Local' and browse database inside it.

Just add this line for improvement.
