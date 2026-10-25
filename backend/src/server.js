import "dotenv/config";
import pg from "pg";
import { PgRegistrationRepository } from "./repository.js";
import { RegistrationService } from "./service.js";
import { createApp } from "./app.js";
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const repository = new PgRegistrationRepository(pool);
const service = new RegistrationService(repository);
createApp(repository, service).listen(process.env.PORT || 3001, () =>
    console.log("CERS API ready on port 3001"),
);
