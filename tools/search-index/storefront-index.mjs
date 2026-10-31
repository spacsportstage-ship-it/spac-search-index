// A transport-only projection for the public storefront. Keep the existing
// prepared index intact for its other consumers. Do not normalize, reorder,
// deduplicate or infer any product values here: the storefront does that itself.
export const storefrontFields=Object.freeze([
 'url','title','brand','color','root','category','categoryLeaf','sizes','image',
 'price','oldPrice','isNew','stock','article','productId','barcode'
]);

export function storefrontIndex(source){
 if(source?.version!=='spac-search-prepared-v1'||!Number.isFinite(Date.parse(source.generatedAt))||!Number.isInteger(source.productCount)||source.productCount<1||source.productCount>20000||!Array.isArray(source.products)||source.productCount!==source.products.length)throw Error('Prepared source metadata changed; storefront projection not published');
 const products=source.products.map(row=>{
  if(!row||typeof row!=='object'||Array.isArray(row))throw Error('Prepared product shape changed');
  return Object.fromEntries(storefrontFields.filter(key=>Object.hasOwn(row,key)).map(key=>[key,row[key]]));
 });
 return {version:source.version,generatedAt:source.generatedAt,productCount:source.productCount,products};
}
