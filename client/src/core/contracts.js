import layout from "../../../site/layout.json";

const componentModules = import.meta.glob("../../../contracts/components/*.schema.json", {
  eager: true,
});

const components = Object.fromEntries(
  Object.entries(componentModules).map(([path, mod]) => {
    const schema = mod.default ?? mod;
    const id = schema?.$id || path.split("/").pop().replace(/\.schema\.json$/i, "");
    return [id, schema];
  })
);

export const layoutContract = layout;
export const componentContracts = components;
export const componentOptions = Object.keys(components).sort();
