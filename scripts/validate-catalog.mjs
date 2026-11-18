import {readFile} from "node:fs/promises";
const read=async path=>JSON.parse(await readFile(new URL(path,import.meta.url),"utf8"));
const models=await read("../src/data/models.json");
const fields=["id","label","sigmaGas","sigmaStar","omega","q","products"];
if(!Array.isArray(models)||!models.length)throw new Error("Catalog must be non-empty.");
const ids=new Set();
for(const model of models){for(const field of fields)if(!(field in model))throw new Error(model.id+" missing "+field);if(ids.has(model.id))throw new Error("Duplicate "+model.id);ids.add(model.id);for(const field of ["sigmaGas","sigmaStar","omega","q"])if(!Number.isFinite(model[field])||model[field]<=0)throw new Error(model.id+" invalid "+field);}
console.log("Validated "+models.length+" synthetic model records.");

const catalog=await read("../catalog/releases.json");
const statuses=new Set(["planned","provisional","published"]);
const productFields=["product","contents","cadence","format","size_per_model"];
if(!Array.isArray(catalog.releases)||!catalog.releases.length)throw new Error("releases must be non-empty.");
for(const r of catalog.releases){
  for(const f of ["release_id","status","model_count","globus_collection_id","doi","license","code_license"])if(!(f in r))throw new Error(r.release_id+" missing "+f);
  if(!statuses.has(r.status))throw new Error(r.release_id+" invalid status "+r.status);
  if(!Number.isInteger(r.model_count)||r.model_count<=0)throw new Error(r.release_id+" invalid model_count");
  if(r.status!=="published"&&r.doi!==null)throw new Error(r.release_id+": DOI stays null until publication");
  const dataLicenses=new Set(["CC-BY-4.0","CC0-1.0"]),codeLicenses=new Set(["BSD-3-Clause","MIT"]);
  if(r.license!==null&&!dataLicenses.has(r.license))throw new Error(r.release_id+" unknown data licence "+r.license);
  if(r.code_license!==null&&!codeLicenses.has(r.code_license))throw new Error(r.release_id+" unknown code licence "+r.code_license);
  if(r.status==="published"&&(r.doi===null||r.license===null))throw new Error(r.release_id+": a published release needs a DOI and a licence");
  const s=r.summary;if(!s)continue;
  for(const f of ["grid_cells","box_pc"])if(!Array.isArray(s[f])||s[f].length!==3||!s[f].every(v=>Number.isInteger(v)&&v>0))throw new Error(r.release_id+" invalid "+f);
  for(const f of ["resolution_pc","end_time_code","code_time_myr"])if(!Number.isFinite(s[f])||s[f]<=0)throw new Error(r.release_id+" invalid "+f);
  s.grid_cells.forEach((n,i)=>{if(n*s.resolution_pc!==s.box_pc[i])throw new Error(r.release_id+": grid × resolution ≠ box along axis "+i);});
  if(!Array.isArray(s.products)||!s.products.length)throw new Error(r.release_id+" needs products");
  for(const p of s.products)for(const f of productFields)if(typeof p[f]!=="string"||!p[f])throw new Error(r.release_id+" product missing "+f);
  const text=JSON.stringify(r);
  for(const bad of ["/projects/","/scratch/","/home/","/tigress/","megatable"])if(text.includes(bad))throw new Error(r.release_id+" contains a private path or restricted name: "+bad);
}
console.log("Validated "+catalog.releases.length+" release record(s).");

import {readdir} from "node:fs/promises";
for(const r of catalog.releases){
  let inv;try{inv=await read("../catalog/"+r.release_id+"/inventory.json");}catch{continue;}
  if(inv.release_id!==r.release_id)throw new Error(r.release_id+": inventory release_id mismatch");
  if(inv.model_count!==r.model_count||inv.models.length!==r.model_count)throw new Error(r.release_id+": inventory has "+inv.models.length+" models, release says "+r.model_count);
  const sums=new Set(await readdir(new URL("../catalog/"+r.release_id+"/checksums/",import.meta.url)));
  let files=0;
  for(const m of inv.models){
    if(!sums.has(m.model_id+".sha256"))throw new Error(r.release_id+": no checksums for "+m.model_id);
    const n=Object.values(m.file_counts).reduce((a,b)=>a+b,0);if(n!==m.files)throw new Error(m.model_id+": file counts do not add up");
    files+=m.files;
  }
  if(files!==inv.total_files)throw new Error(r.release_id+": total_files mismatch");
  if(/\/(projects|scratch|home|tigress)\//.test(JSON.stringify(inv)))throw new Error(r.release_id+": private path in inventory");
  console.log("Validated inventory of "+inv.models.length+" models ("+inv.total_files+" files) for "+r.release_id+".");
}
