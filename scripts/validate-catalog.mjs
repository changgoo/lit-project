import {readFile} from "node:fs/promises";
const models=JSON.parse(await readFile(new URL("../src/data/models.json",import.meta.url),"utf8"));
const fields=["id","label","sigmaGas","sigmaStar","omega","q","products"];
if(!Array.isArray(models)||!models.length)throw new Error("Catalog must be non-empty.");
const ids=new Set();
for(const model of models){for(const field of fields)if(!(field in model))throw new Error(model.id+" missing "+field);if(ids.has(model.id))throw new Error("Duplicate "+model.id);ids.add(model.id);for(const field of ["sigmaGas","sigmaStar","omega","q"])if(!Number.isFinite(model[field])||model[field]<=0)throw new Error(model.id+" invalid "+field);}
console.log("Validated "+models.length+" synthetic model records.");
