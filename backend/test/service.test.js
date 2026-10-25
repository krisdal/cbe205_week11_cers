import test from "node:test";
import assert from "node:assert/strict";
import { RegistrationService } from "../src/service.js";
function fake({
  status = "REGISTRATION_OPEN",
  count = 0,
  duplicate = false,
  capacity = 2,
} = {}) {
  const event = {
    status,
    capacity,
    registration_open_at: "2026-01-01T00:00:00Z",
    registration_close_at: "2027-01-01T00:00:00Z",
  };
  const tx = {
    lockEvent: async () => event,
    exists: async () => duplicate,
    countConfirmed: async () => count,
    create: async () => ({ registration_id: "R1", status: "CONFIRMED" }),
  };
  return { transaction: (fn) => fn(tx) };
}
const clock = () => new Date("2026-10-24T00:00:00Z");
test("successful registration", async () => {
  const result = await new RegistrationService(fake(), clock).register(
    "S001",
    "E1",
  );
  assert.equal(result.status, "CONFIRMED");
});
// test("rejects duplicate", async () => {
//   await assert.rejects(
//     () =>
//       new RegistrationService(fake({ duplicate: true }), clock).register(
//         "S001",
//         "E1",
//       ),
//     { code: "DUPLICATE" },
//   );
// });
test("rejects full event", async () => {
  await assert.rejects(
    () =>
      new RegistrationService(fake({ count: 2 }), clock).register("S001", "E1"),
    { code: "FULL" },
  );
});
test("rejects closed event", async () => {
  await assert.rejects(
    () =>
      new RegistrationService(
        fake({ status: "REGISTRATION_CLOSED" }),
        clock,
      ).register("S001", "E1"),
    { code: "CLOSED" },
  );
});
