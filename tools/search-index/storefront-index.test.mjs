import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,readFile,access,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const builder=fileURLToPath(new URL('./build-prepared-search-index.mjs',import.meta.url));
const fields=['url','title','brand','color','root','category','categoryLeaf','sizes','image','price','oldPrice','isNew','stock','article','productId','barcode'];
async function build(data,check){
 const directory=await mkdtemp(path.join(tmpdir(),'spac-storefront-test-'));
 try{
  const worker=path.join(directory,'source.mjs'),output=path.join(directory,'prepared.json');
  const body=JSON.stringify(data);
  await writeFile(worker,'const PREPARED_BUILD_ENABLED = false;\nexport default {fetch(){return new Response('+JSON.stringify(body)+',{headers:{"Content-Type":"application/json"}});}};');
  const result=spawnSync(process.execPath,[builder],{env:{...process.env,SPAC_WORKER_FILE:worker,SPAC_PREPARED_OUT:output},encoding:'utf8'});
  await check({directory,output,body,result});
 }finally{assert.ok(path.resolve(directory).startsWith(path.join(path.resolve(tmpdir()),'spac-storefront-test-')));await rm(directory,{recursive:true,force:true});}
}
const product={url:'https://www.spacsport.nl/dames/jacket_001.html?channable=1',title:'Beta "AR" dames',brand:'ARCTERYX',color:'Blauw',root:'Dames',category:'Dames > Jassen',categoryLeaf:'Jassen',sizes:['36','38 2/3'],image:'https://www.spacsport.nl/img/001.jpg',price:'EUR 1.234,50',oldPrice:'EUR 1.500,00',isNew:true,stock:'3',article:'000001',productId:'001',barcode:'000123',allTokens:['unused'],visibleCompact:'unused',rank:19};
const sample=products=>({version:'spac-search-prepared-v1',generatedAt:'2026-10-31T21:00:00.000Z',productCount:products.length,products});

test('builder preserves original prepared bytes and emits only the fields the storefront reads',async()=>{
 await build(sample([product,{url:'https://www.spacsport.nl/other_002.html',title:'Other',sizes:[],isNew:false}]),async({directory,output,body,result})=>{
  assert.equal(result.status,0,result.stderr);assert.equal(await readFile(output,'utf8'),body);
  const exists=await access(path.join(directory,'storefront.json')).then(()=>true,()=>false);assert.equal(exists,true,'storefront sidecar must be generated');
  const sidecar=JSON.parse(await readFile(path.join(directory,'storefront.json'),'utf8'));
  const expected=JSON.parse(body);expected.products=expected.products.map(row=>Object.fromEntries(fields.filter(key=>Object.hasOwn(row,key)).map(key=>[key,row[key]])));
  assert.deepEqual(sidecar,expected);assert.equal(sidecar.products[0].article,'000001');assert.equal(sidecar.products[1].isNew,false);
 });
});

for(const [name,edit]of [
 ['count mismatch',source=>({...source,productCount:2})],
 ['unknown version',source=>({...source,version:'future-format'})],
 ['invalid timestamp',source=>({...source,generatedAt:'invalid'})],
 ['empty source',source=>({...source,productCount:0,products:[]})]
])test('rejects '+name+' before either output can be published',async()=>{
 await build(edit(sample([product])),async({directory,output,result})=>{
  assert.notEqual(result.status,0,'invalid source must fail');
  assert.equal(await access(output).then(()=>true,()=>false),false);
  assert.equal(await access(path.join(directory,'storefront.json')).then(()=>true,()=>false),false);
 });
});
