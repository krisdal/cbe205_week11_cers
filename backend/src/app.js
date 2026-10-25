import express from "express";
import { RegistrationError } from "./errors.js";
export function createApp(repository, service) {
  const app = express();
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
  });
  app.use(express.json());
  app.get("/api/events", async (_req, res, next) => {
    try {
      res.json(await repository.listEvents());
    } catch (e) {
      next(e);
    }
  });
  app.get("/api/events/:id", async (req, res, next) => {
    try {
      const event = await repository.getEvent(req.params.id);
      if (!event) return res.status(404).json({ error: "Event not found" });
      res.json(event);
    } catch (e) {
      next(e);
    }
  });
  app.post("/api/events/:id/registrations", async (req, res, next) => {
    try {
      const registration = await service.register("S001", req.params.id);
      res.status(201).json(registration);
    } catch (e) {
      next(e);
    }
  });
  app.use((err, _req, res, _next) => {
    if (err instanceof RegistrationError)
      return res
        .status(err.code === "NOT_FOUND" ? 404 : 409)
        .json({ error: err.message, code: err.code });
    if (err.code === "23505")
      return res
        .status(409)
        .json({ error: "Already registered", code: "DUPLICATE" });
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  });
  return app;
}
