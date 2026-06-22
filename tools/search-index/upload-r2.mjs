import { createHash, createHmac } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function sha256Hex(value) {
  return createHash("sha256").update(value).digest("hex");
}

function hmac(key, value, encoding) {
  return createHmac("sha256", key).update(value).digest(encoding);
}

function uriEncode(value) {
  return encodeURIComponent(value).replace(/[!'()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
}

function r2ObjectPath(bucket, objectKey) {
  const keyPath = objectKey.split("/").filter(Boolean).map(uriEncode).join("/");
  return `/${uriEncode(bucket)}/${keyPath}`;
}

function amzDateParts(date = new Date()) {
  const amzDate = date.toISOString().replace(/[:-]|\.\d{3}/g, "");
  return {
    amzDate,
    dateStamp: amzDate.slice(0, 8),
  };
}

function signingKey(secretAccessKey, dateStamp) {
  const kDate = hmac(`AWS4${secretAccessKey}`, dateStamp);
  const kRegion = hmac(kDate, "auto");
  const kService = hmac(kRegion, "s3");
  return hmac(kService, "aws4_request");
}

async function main() {
  const accountId = requiredEnv("R2_ACCOUNT_ID");
  const accessKeyId = requiredEnv("R2_ACCESS_KEY_ID");
  const secretAccessKey = requiredEnv("R2_SECRET_ACCESS_KEY");
  const bucket = requiredEnv("R2_BUCKET");
  const objectKey = process.env.R2_OBJECT_KEY || "prepared.json";
  const publicUrl = process.env.R2_PUBLIC_URL || "";
  const filePath = path.resolve(process.env.R2_FILE || path.join(process.cwd(), "dist", "prepared.json"));
  const body = await readFile(filePath);

  const host = `${accountId}.r2.cloudflarestorage.com`;
  const canonicalUri = r2ObjectPath(bucket, objectKey);
  const endpoint = `https://${host}${canonicalUri}`;
  const { amzDate, dateStamp } = amzDateParts();
  const payloadHash = sha256Hex(body);
  const cacheControl = "public, max-age=300, s-maxage=300, stale-while-revalidate=300";
  const contentType = "application/json; charset=utf-8";
  const signedHeaders = "cache-control;content-type;host;x-amz-content-sha256;x-amz-date";
  const canonicalHeaders = [
    `cache-control:${cacheControl}`,
    `content-type:${contentType}`,
    `host:${host}`,
    `x-amz-content-sha256:${payloadHash}`,
    `x-amz-date:${amzDate}`,
    "",
  ].join("\n");
  const canonicalRequest = ["PUT", canonicalUri, "", canonicalHeaders, signedHeaders, payloadHash].join("\n");
  const credentialScope = `${dateStamp}/auto/s3/aws4_request`;
  const stringToSign = ["AWS4-HMAC-SHA256", amzDate, credentialScope, sha256Hex(canonicalRequest)].join("\n");
  const signature = hmac(signingKey(secretAccessKey, dateStamp), stringToSign, "hex");
  const authorization = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const response = await fetch(endpoint, {
    method: "PUT",
    headers: {
      "Authorization": authorization,
      "Cache-Control": cacheControl,
      "Content-Type": contentType,
      "X-Amz-Content-Sha256": payloadHash,
      "X-Amz-Date": amzDate,
    },
    body,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`R2 upload failed with HTTP ${response.status}: ${errorBody.slice(0, 1000)}`);
  }

  const target = publicUrl ? new URL(objectKey, publicUrl.endsWith("/") ? publicUrl : `${publicUrl}/`).toString() : endpoint;
  console.log(`Uploaded ${filePath} to ${bucket}/${objectKey}`);
  console.log(`Target: ${target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
