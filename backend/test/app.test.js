import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/app.js";

async function withServer(app, run) {
  const server = app.listen(0);
  try {
    await new Promise((resolve) => server.once("listening", resolve));
    const { port } = server.address();
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
}

test("health check reports API and database readiness", async () => {
  let healthChecks = 0;
  const app = createApp({ checkHealth: async () => healthChecks++ }, {});

  await withServer(app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/health`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      status: "ok",
      database: "ok",
    });
  });

  assert.equal(healthChecks, 1);
});

test("health check reports database unavailability", async () => {
  const app = createApp(
    {
      checkHealth: async () => {
        throw new Error("database unavailable");
      },
    },
    {},
  );
  const originalError = console.error;
  console.error = () => {};

  try {
    await withServer(app, async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/health`);
      assert.equal(response.status, 503);
      assert.deepEqual(await response.json(), {
        status: "error",
        database: "unavailable",
      });
    });
  } finally {
    console.error = originalError;
  }
});
