import test from "ava";
import Database from "better-sqlite3";
import { ERRORS, TaxonicError } from "@taxonic/core/errors";
import { careBearSchema as schema } from "../../fixtures/care-bear-schema.js";
import { SQLiteStore } from "../../../src/sqlite-store.js";
import { careBearData } from "../../fixtures/care-bear-data.js";
import { createTables, seed } from "../../../src/actions/seed.js";

// Test Setup
test.beforeEach(async (t) => {
  const db = Database(":memory:");
  createTables(schema, db);
  seed(schema, db, careBearData);

  const store = await SQLiteStore(schema, db);

  // eslint-disable-next-line no-param-reassign
  t.context = { store };
});

test("gets the first result from a collection", async (t) => {
  const result = await t.context.store.get({ type: "bears", first: true });
  t.deepEqual(result, { id: "1" });
});

test("throws an error when trying to get the first on a singular resource", async (t) => {
  await t.throwsAsync(
    async () => {
      const bad = await t.context.store.get({ type: "bears", id: "1", first: true });
      console.log(bad);
    },
    { instanceOf: TaxonicError, message: ERRORS.FIRST_NOT_ALLOWED_ON_SINGULAR },
  );
});
