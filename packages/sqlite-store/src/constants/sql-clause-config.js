const defaultClause = {
  compose: (acc, item) => [...(acc ?? []), ...(item ?? [])],
  initVal: [],
};

export const SQL_CLAUSE_CONFIG = {
  select: {
    ...defaultClause,
    toSql: (val) => `SELECT ${val.join(", ")}`,
  },
  from: {
    ...defaultClause,
    compose: (_, item) => item,
    initVal: null,
    toSql: (val) => `FROM ${val}`,
  },
  join: {
    ...defaultClause,
    toSql: (val) => val.join("\n"),
  },
  where: {
    ...defaultClause,
    toSql: (val) => (val.length > 0 ? `WHERE ${val.join("\nAND ")}` : ""),
  },
  vars: {
    ...defaultClause,
    toSql: () => "",
  },
  orderBy: {
    ...defaultClause,
    toSql: (val) => {
      if (val.length === 0) return "";

      const orderClauses = val.map(
        ({ property, direction, table }) =>
          `${table}.${property}${direction === "desc" ? " DESC" : ""}`,
      );
      return `ORDER BY ${orderClauses.join(", ")}`;
    },
  },
  limit: {
    ...defaultClause,
    compose: (acc, item) => Math.min(acc, item),
    initVal: Infinity,
    toSql: (val) => (val < Infinity ? `LIMIT ${val}` : ""),
  },
  offset: {
    ...defaultClause,
    compose: (_, item) => item,
    initVal: 0,
    toSql: (val) => (val > 0 ? `OFFSET ${val}` : ""),
  },
};
