import { mapObj, partitionObj, pick } from "@taxonic/utils/objects";

export function defaultResource(schema, resourceType) {
  return mapObj(schema.resources[resourceType].properties, (propDef) =>
    propDef.type === "relationship"
      ? propDef.cardinality === "one"
        ? null
        : []
      : propDef.default,
  );
}

export function normalizeResource(schema, type, resource) {
  const [relProps, nonRelProps] = partitionObj(
    schema.resources[type].properties,
    (propDef) => propDef.type === "relationship",
  );

  return {
    type,
    id: resource[schema.idField],
    properties: pick(resource, Object.keys(nonRelProps)),
    relationships: pick(resource, Object.keys(relProps)),
  };
}
