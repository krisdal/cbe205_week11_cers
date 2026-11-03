import { RegistrationError } from "./errors.js";
export class RegistrationService {
  constructor(repository, clock = () => new Date()) {
    this.repository = repository;
    this.clock = clock;
  }
  async register(studentId, eventId) {
    return this.repository.transaction(async (tx) => {
      const event = await tx.lockEvent(eventId);
      if (!event) throw new RegistrationError("NOT_FOUND", "Event not found");
      const now = this.clock();
      if (
        event.status !== "REGISTRATION_OPEN" ||
        now < new Date(event.registration_open_at) ||
        now >= new Date(event.registration_close_at)
      )
        throw new RegistrationError("CLOSED", "Registration is closed");
      if (await tx.exists(studentId, eventId))
        throw new RegistrationError("DUPLICATE", "You have already registered");
      if ((await tx.countConfirmed(eventId)) >= event.capacity)
        throw new RegistrationError("FULL", "This event is full");
      return tx.create(studentId, eventId);
    });
  }
}
