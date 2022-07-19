import test from "ava";
import Database from "better-sqlite3";
import { ERRORS, PolygraphError } from "@polygraph/core/errors";
import { careBearSchema as schema } from "../../fixtures/care-bear-schema.mjs";
import { SQLiteStore } from "../../../src/sqlite-store.mjs";
import { careBearData } from "../../fixtures/care-bear-data.mjs";
import { createTables, seed } from "../../../src/actions/seed.mjs";

// Test Setup
test.beforeEach(async (t) => {
  const db = Database(":memory:");
  createTables(schema, db);
  seed(schema, db, careBearData);

  const store = await SQLiteStore(schema, db);

  // eslint-disable-next-line no-param-reassign
  t.context = { store };
});

test.skip("filters on a property equality constraint", async (t) => {
  const result = await t.context.store.get({
    type: "bears",
    constraints: { name: "Cheer Bear" },
  });

  t.deepEqual(result, [{ id: "2" }]);
});

test.skip("filters on multiple property equality constraints", async (t) => {
  const result = await t.context.store.get({
    type: "homes",
    constraints: {
      caring_meter: 1,
      is_in_clouds: false,
    },
  });

  t.deepEqual(result, [{ id: "2" }]);
});

test.skip("filters using $eq operator", async (t) => {
  const result = await t.context.store.get({
    type: "bears",
    constraints: {
      year_introduced: { $eq: 2005 },
    },
  });

  t.deepEqual(result, [{ id: "5" }]);
});

test.skip("filters using $gt operator", async (t) => {
  const result = await t.context.store.get({
    type: "bears",
    constraints: {
      year_introduced: { $gt: 2000 },
    },
  });

  t.deepEqual(result, [{ id: "5" }]);
});

test.skip("filters using $lt operator", async (t) => {
  const result = await t.context.store.get({
    type: "bears",
    constraints: {
      year_introduced: { $lt: 2000 },
    },
  });

  t.deepEqual(result, [{ id: "1" }, { id: "2" }, { id: "3" }]);
});

test.skip("filters using $lte operator", async (t) => {
  const result = await t.context.store.get({
    type: "bears",
    constraints: {
      year_introduced: { $lte: 2000 },
    },
  });

  t.deepEqual(result, [{ id: "1" }, { id: "2" }, { id: "3" }]);
});

test.skip("filters using $gte operator", async (t) => {
  const result = await t.context.store.get({
    type: "bears",
    constraints: {
      year_introduced: { $gte: 2005 },
    },
  });

  t.deepEqual(result, [{ id: "5" }]);
});

test.skip("filters using $in 1", async (t) => {
  const result = await t.context.store.get({
    type: "bears",
    constraints: {
      year_introduced: { $in: [2005, 2022] },
    },
  });

  t.deepEqual(result, [{ id: "5" }]);
});

test.skip("filters using $in 2", async (t) => {
  const result = await t.context.store.get({
    type: "bears",
    constraints: {
      year_introduced: { $in: [2022] },
    },
  });

  t.deepEqual(result, []);
});

test.skip("filters using $ne operator", async (t) => {
  const result = await t.context.store.get({
    type: "bears",
    constraints: {
      year_introduced: { $ne: 2005 },
    },
  });

  t.deepEqual(result, [{ id: "1" }, { id: "2" }, { id: "3" }]);
});

test.skip("filters related resources", async (t) => {
  const result = await t.context.store.get({
    type: "powers",
    id: "careBearStare",
    relationships: {
      bears: {
        constraints: {
          year_introduced: { $gt: 2000 },
        },
      },
    },
  });

  t.deepEqual(result, { id: "careBearStare", bears: [{ id: "5" }] });
});