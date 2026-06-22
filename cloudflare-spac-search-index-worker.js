const CHANNABLE_FEED_URL = "https://files.channable.com/q8jk53gX0RKnaEoOmcS8hQ==.json";
const CACHE_TTL_SECONDS = 300;
const PREPARED_VERSION = "spac-search-prepared-v1";
const PREPARED_BUILD_ENABLED = false;

const ALLOWED_ORIGINS = new Set([
  "https://www.spacsport.nl",
  "https://spacsport.nl",
]);

const STOP_WORDS = {
  de: true, het: true, een: true, en: true, of: true, voor: true, van: true,
  met: true, op: true, in: true, aan: true, bij: true, naar: true, uit: true,
  te: true, om: true, als: true,
};

const JACKET_TERMS = ["jas", "jassen", "jack", "jacks", "jacket", "jackets", "outdoorjas", "wandeljas", "regenjas", "regenjassen", "regenjack", "regenjacks", "waterdichtejas", "waterdichtejassen", "hardshell", "hardshells", "shell", "shelljas", "shelljassen", "softshell", "softshells", "softshelljas", "softshelljassen", "donsjas", "donsjassen", "parka", "parkas", "winterjas", "winterjassen", "tussenjas", "tussenjassen", "windstopper", "windstoppers", "bodywarmer", "bodywarmers", "3in1jas", "3in1jassen"];
const WATERPROOF_TERMS = ["regenjas", "regenjassen", "regenjack", "regenjacks", "waterdicht", "waterdichte", "waterproof", "waterdichtejas", "waterdichtejassen", "hardshell", "hardshells", "shell", "shelljas", "shelljassen", "gtx", "goretex"];
const FOOTWEAR_TERMS = ["schoen", "schoenen", "wandelschoen", "wandelschoenen", "bergschoen", "bergschoenen", "trailrun", "trailrunning", "trailrunschoen", "trailrunschoenen", "sandaal", "sandalen", "slipper", "slippers"];
const TROUSER_TERMS = ["broek", "broeken", "regenbroek", "regenbroeken", "pants", "trousers", "short", "shorts"];
const WALKING_FOOTWEAR_TERMS = ["wandelschoen", "wandelschoenen", "bergschoen", "bergschoenen"];
const TRAIL_FOOTWEAR_TERMS = ["trailrun", "trailrunning", "trailrunschoen", "trailrunschoenen"];
const RAIN_PANTS_TERMS = ["regenbroek", "regenbroeken", "rainpant", "rainpants"];
const FLEECE_TERMS = ["fleece", "fleeces"];
const BACKPACK_TERMS = ["rugzak", "rugzakken", "dagrugzak", "dagrugzakken", "reisrugzak", "reisrugzakken", "trekkingrugzak", "trekkingrugzakken", "wandelrugzak", "wandelrugzakken", "backpack", "backpacks"];
const SOFTSHELL_TERMS = ["softshell", "softshells", "softshelljas", "softshelljassen"];
const HARDSHELL_TERMS = ["hardshell", "hardshells", "shelljas", "shelljassen", "gtx", "goretex"];
const DOWN_TERMS = ["donsjas", "donsjassen", "down"];
const SANDAL_TERMS = ["sandaal", "sandalen", "slipper", "slippers"];

const SEARCH_SYNONYMS = {
  jas: ["jassen", "jack", "jacks", "jacket", "jackets", "regenjas", "regenjassen", "shelljas", "hardshell"],
  jassen: ["jas", "jack", "jacks", "jacket", "jackets", "regenjas", "regenjassen", "shelljas", "hardshell"],
  jack: ["jas", "jassen", "jacks", "jacket"],
  jacks: ["jack", "jas", "jassen", "jackets"],
  jacket: ["jackets", "jas", "jassen", "jack"],
  jackets: ["jacket", "jas", "jassen", "jacks"],
  regenjas: ["regenjassen", "regenjack", "hardshell", "waterdicht", "waterdichte", "waterproof", "jas", "jassen", "jack"],
  regenjassen: ["regenjas", "regenjack", "hardshell", "waterdicht", "waterdichte", "waterproof", "jas", "jassen", "jack"],
  regenjack: ["regenjas", "regenjassen", "regenjacks", "waterdicht", "waterdichte", "jas", "jassen", "jack"],
  regenkleding: ["regenjas", "regenjassen", "regenbroek", "regenbroeken", "hardshell", "waterdichte", "poncho"],
  waterdicht: ["waterdichte", "waterproof", "regenjas", "regenjassen", "hardshell", "shelljas", "jas", "jassen"],
  waterdichte: ["waterdicht", "waterproof", "regenjas", "regenjassen", "hardshell", "shelljas", "jas", "jassen"],
  waterproof: ["waterdicht", "waterdichte", "regenjas", "regenjassen", "hardshell", "shelljas", "jas", "jassen"],
  hardshell: ["hardshells", "regenjas", "regenjassen", "shell", "shelljas", "waterdicht", "waterdichte", "jas", "jassen"],
  hardshells: ["hardshell", "regenjas", "regenjassen", "shell", "shelljas", "waterdicht", "waterdichte", "jas", "jassen"],
  shelljas: ["shelljassen", "shell", "hardshell", "waterdicht", "waterdichte", "jas", "jassen"],
  shelljassen: ["shelljas", "shell", "hardshell", "waterdicht", "waterdichte", "jas", "jassen"],
  softshell: ["softshells", "softshelljas", "softshelljassen", "jas", "jassen"],
  softshells: ["softshell", "softshelljas", "softshelljassen", "jas", "jassen"],
  donsjas: ["donsjassen", "down", "jacket", "jas", "jassen"],
  donsjassen: ["donsjas", "down", "jackets", "jas", "jassen"],
  gtx: ["goretex", "gore", "tex", "waterproof", "waterdicht"],
  goretex: ["gtx", "gore", "tex", "waterproof", "waterdicht"],
  schoen: ["schoenen"],
  schoenen: ["schoen"],
  wandelschoen: ["wandelschoenen", "wandel", "schoen", "schoenen"],
  wandelschoenen: ["wandelschoen", "wandel", "schoen", "schoenen"],
  bergschoen: ["bergschoenen", "wandelschoen", "schoen", "schoenen"],
  bergschoenen: ["bergschoen", "wandelschoen", "schoen", "schoenen"],
  trailrun: ["trailrunning", "trailrunschoen", "trailrunschoenen"],
  trailrunning: ["trailrun", "trailrunschoen", "trailrunschoenen"],
  trailrunschoen: ["trailrunschoenen", "trailrun", "trailrunning", "schoen", "schoenen"],
  trailrunschoenen: ["trailrunschoen", "trailrun", "trailrunning", "schoen", "schoenen"],
  broek: ["broeken"],
  broeken: ["broek"],
  regenbroek: ["regenbroeken", "waterdicht", "waterdichte", "broek", "broeken"],
  regenbroeken: ["regenbroek", "waterdicht", "waterdichte", "broek", "broeken"],
  rugzak: ["rugzakken", "backpack", "backpacks"],
  rugzakken: ["rugzak", "backpack", "backpacks"],
  dagrugzak: ["dagrugzakken", "rugzak", "rugzakken", "backpack"],
  dagrugzakken: ["dagrugzak", "rugzak", "rugzakken", "backpack"],
  reisrugzak: ["reisrugzakken", "rugzak", "rugzakken", "backpack"],
  reisrugzakken: ["reisrugzak", "rugzak", "rugzakken", "backpack"],
  trekkingrugzak: ["trekkingrugzakken", "rugzak", "rugzakken", "backpack"],
  trekkingrugzakken: ["trekkingrugzak", "rugzak", "rugzakken", "backpack"],
  wandelrugzak: ["wandelrugzakken", "rugzak", "rugzakken", "backpack"],
  wandelrugzakken: ["wandelrugzak", "rugzak", "rugzakken", "backpack"],
  backpack: ["backpacks", "rugzak", "rugzakken"],
  backpacks: ["backpack", "rugzak", "rugzakken"],
  fleece: ["fleeces"],
  fleeces: ["fleece"],
  sandaal: ["sandalen"],
  sandalen: ["sandaal"],
  slipper: ["slippers"],
  slippers: ["slipper"],
};

const JACKET_RE = /regenjassen?|regenjacks?|waterdichtejassen?|jassen?|jacks?|jackets?|outdoorjassen?|wandeljassen?|hardshells?|softshells?|shelljassen?|donsjassen?|winterjassen?|tussenjassen?|windstoppers?|bodywarmers?|3in1jassen?|parkas?/;
const WATERPROOF_RE = /regenjassen?|regenjacks?|waterdichtejassen?|waterdicht|waterproof|hardshells?|shelljassen?|goretex|gtx/;
const RAINWEAR_RE = /regenkleding|regenjassen?|regenjacks?|regenbroeken?|waterdichtejassen?|hardshells?|shelljassen?|ponchos?/;
const WATERPROOF_NON_JACKET_RE = /drybags?|waterdichtezak|waterdichtetas|regenhoezen?|raincover|rugzakhoes|waterproofing|schoenonderhoud|onderhoud|impregneer|impregneerspray|spray|wax|washin|techwash/;
const NON_JACKET_FOR_JACKET_QUERY_RE = /schoenen?|wandelschoenen?|bergschoenen?|trailrunschoenen?|sandalen?|slippers?|handschoenen?|wanten|gloves?|hoeden|petten|mutsen|sokken|tassen|rugzakken?|backpacks?|accessoires|kledingaccessoires|drybags?|waterdichtezak|waterdichtetas|regenhoezen?|raincover|rugzakhoes|onderhoud|impregneer|impregneerspray|spray|wax|washin|techwash/;
const BACKPACK_RE = /(?:dag|reis|trekking|wandel)?rugzak(?:ken)?|backpacks?/;
const NON_BACKPACK_RE = /rugzakponchos?|drinksystemen?|drinksysteem|reservoirs?|waterzakken?|hydraulics?|duffels?|duffelbags?|reistassen?|handbagage|heuptassen?|schoudertassen?|koeltassen?|koeltas|koeling|packingcubes?|regenhoezen?|raincovers?|rugzakhoezen?|rugzakhoes|accessoires/;
const WALKING_FOOTWEAR_RE = /wandelschoenen?|bergschoenen?|hikingboots?|hikingschoenen?|approachschoenen?/;
const TRAIL_FOOTWEAR_RE = /trailrunschoenen?|trailrunningschoenen?|trailrun|trailrunning/;
const RAIN_PANTS_RE = /regenbroeken?|rainpants?/;
const NON_WALKING_FOOTWEAR_RE = /sandalen?|slippers?|pantoffels?|sloffen|klimschoenen?|waterschoenen?/;

function corsHeaders(request) {
  const origin = request.headers.get("Origin") || "";
  const allowOrigin = ALLOWED_ORIGINS.has(origin) ? origin : "https://www.spacsport.nl";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, If-None-Match, If-Modified-Since",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin, Accept-Encoding",
  };
}

function jsonResponse(body, status, request) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...corsHeaders(request),
    },
  });
}

function decodeXml(value) {
  return String(value || "")
    .replace(/^<!\[CDATA\[/, "")
    .replace(/\]\]>$/, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " en ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function compact(value) {
  return normalize(value).replace(/\s+/g, "");
}

function addSearchToken(set, token) {
  token = normalize(token);
  if (!token || STOP_WORDS[token] || (token.length < 2 && !/^\d$/.test(token))) return;
  set[token] = true;
}

function tokenString(set) {
  const keys = Object.keys(set || {}).sort();
  return keys.length ? `|${keys.join("|")}|` : "";
}

function stemSearchToken(token) {
  const stems = {
    schoenen: "schoen", wandelschoenen: "wandelschoen", jassen: "jas",
    jacks: "jack", jackets: "jacket", regenjassen: "regenjas",
    regenjacks: "regenjack", shelljassen: "shelljas", hardshells: "hardshell",
    softshells: "softshell", softshelljassen: "softshelljas", donsjassen: "donsjas",
    winterjassen: "winterjas", tussenjassen: "tussenjas", bodywarmers: "bodywarmer",
    waterdichte: "waterdicht", truien: "trui", vesten: "vest", blouses: "blouse",
    shirts: "shirt", rode: "rood", roden: "rood", zwarte: "zwart",
    zwarten: "zwart", blauwe: "blauw", groenen: "groen", groene: "groen",
    grijze: "grijs", gele: "geel", paarse: "paars", bruine: "bruin",
    witte: "wit", broeken: "broek", regenbroeken: "regenbroek",
    rainpants: "rainpant", bergschoenen: "bergschoen", rugzakken: "rugzak",
    dagrugzakken: "dagrugzak", reisrugzakken: "reisrugzak",
    trekkingrugzakken: "trekkingrugzak", wandelrugzakken: "wandelrugzak",
    backpacks: "backpack", trailrunning: "trailrun",
    trailrunschoenen: "trailrunschoen", fleeces: "fleece", ponchos: "poncho",
  };
  return stems[token] || token;
}

function addCompoundSearchParts(set, token) {
  if (!token) return;
  if (token.includes("heren")) addSearchToken(set, "heren");
  if (token.includes("dames")) addSearchToken(set, "dames");
  if (token.includes("kids") || token.includes("kind")) addSearchToken(set, "kids");
  if (token.includes("wandelschoen") || token.includes("bergschoen")) {
    ["wandel", "wandelschoen", "wandelschoenen", "bergschoen", "bergschoenen", "schoen", "schoenen"].forEach((item) => addSearchToken(set, item));
  } else if (token.includes("wandel")) {
    addSearchToken(set, "wandel");
  }
  if (token.includes("trailrun") || token.includes("trailrunning")) {
    ["trailrun", "trailrunning", "trailrunschoen", "trailrunschoenen", "schoen", "schoenen"].forEach((item) => addSearchToken(set, item));
  }
  if (token.includes("schoen") && !token.includes("handschoen") && !token.includes("sneeuwschoen")) {
    addSearchToken(set, "schoen");
    addSearchToken(set, "schoenen");
  }
  if (token.includes("broek")) {
    addSearchToken(set, "broek");
    addSearchToken(set, "broeken");
    if (token.includes("regenbroek")) ["regenbroek", "regenbroeken", "waterdicht", "waterdichte"].forEach((item) => addSearchToken(set, item));
  }
  if (token.includes("rugzak") || token.includes("backpack")) {
    ["rugzak", "rugzakken", "dagrugzak", "dagrugzakken", "reisrugzak", "reisrugzakken", "backpack", "backpacks"].forEach((item) => addSearchToken(set, item));
  }
  if (token.includes("regenjas") || token.includes("regenjack") || token.includes("waterdicht") || token.includes("waterproof") || token.includes("hardshell") || token.includes("shelljas") || token.includes("goretex") || token === "gtx") {
    ["regenjas", "regenjassen", "regenjack", "jas", "jassen", "jack", "waterdicht", "waterdichte", "waterproof", "hardshell", "shelljas"].forEach((item) => addSearchToken(set, item));
  }
  if (/jassen?$/.test(token) || /jacks?$/.test(token) || /jackets?$/.test(token) || token.includes("jassen")) {
    ["jas", "jassen", "jack", "jacks"].forEach((item) => addSearchToken(set, item));
  }
}

function directTokenSet(value) {
  const set = {};
  normalize(value).split(" ").forEach((token) => {
    const stem = stemSearchToken(token);
    addSearchToken(set, token);
    addSearchToken(set, stem);
  });
  return tokenString(set);
}

function tokenSet(value) {
  const set = {};
  normalize(value).split(" ").forEach((token) => {
    const stem = stemSearchToken(token);
    addSearchToken(set, token);
    addSearchToken(set, stem);
    addCompoundSearchParts(set, token);
    (SEARCH_SYNONYMS[token] || SEARCH_SYNONYMS[stem] || []).forEach((synonym) => {
      addSearchToken(set, synonym);
      addCompoundSearchParts(set, synonym);
    });
  });
  return tokenString(set);
}

function hasToken(set, token) {
  token = normalize(token);
  if (!set || !token) return false;
  if (typeof set === "string") return set.includes(`|${token}|`);
  return !!set[token];
}

function hasAnyToken(set, terms) {
  return (terms || []).some((term) => hasToken(set, term));
}

function canonicalUrl(value) {
  try {
    const parsed = new URL(value, "https://www.spacsport.nl");
    return parsed.pathname.replace(/\/+$/g, "").toLowerCase();
  } catch {
    return String(value || "").split("?")[0].replace(/\/+$/g, "").toLowerCase();
  }
}

function labelFromSlug(value) {
  let text = "";
  try {
    text = decodeURIComponent(String(value || ""));
  } catch {
    text = String(value || "");
  }
  text = text
    .replace(/\.html.*$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\bn v t\b/gi, "N.V.T")
    .replace(/\s+/g, " ")
    .trim();
  return text ? text.replace(/\b[a-z]/g, (letter) => letter.toUpperCase()) : "";
}

function priceAmount(value) {
  let raw;
  const text = decodeXml(value).replace(/\s+/g, "");
  const match = text.match(/-?\d[\d.,]*/g);
  if (!match) return NaN;
  raw = match[match.length - 1];
  const comma = raw.lastIndexOf(",");
  const dot = raw.lastIndexOf(".");
  if (comma !== -1 && dot !== -1) raw = comma > dot ? raw.replace(/\./g, "").replace(",", ".") : raw.replace(/,/g, "");
  else if (comma !== -1) raw = raw.replace(/\./g, "").replace(",", ".");
  else if (dot !== -1 && raw.length - dot - 1 === 3) raw = raw.replace(/\./g, "");
  return parseFloat(raw);
}

function parsePrice(value) {
  const number = priceAmount(value);
  return Number.isFinite(number) ? `\u20ac ${number.toFixed(2).replace(".", ",")}` : "";
}

function isRealSize(value) {
  const key = compact(value);
  return !!key && !["nvt", "na", "none", "null"].includes(key);
}

function isRealColor(value) {
  const key = compact(value);
  return !!key && !["nvt", "na", "none", "null"].includes(key);
}

function audienceLabel(value) {
  const text = normalize(value);
  if (!text) return "";
  if (/\b(kids?|kind|kinderen|junior|juniors|jongens?|meisjes?|children|youth)\b/.test(text)) return "Kids";
  if (/\b(dames?|vrouw|vrouwen|female|women|ladies)\b/.test(text)) return "Dames";
  if (/\b(heren?|man|mannen|male|men)\b/.test(text)) return "Heren";
  return "";
}

function normalizeAudience(product) {
  const current = audienceLabel(product.root);
  if (current) {
    product.root = current;
    return current;
  }
  product.root = audienceLabel([product.gender, product.title, product.category, product.categoryLeaf, product.pathText].join(" "));
  return product.root;
}

function normalizeCategoryAudience(product) {
  const rootAudience = audienceLabel(product.root);
  if (!rootAudience || !product.category) return;
  const parts = String(product.category).split("/").map((part) => part.replace(/\s+/g, " ").trim()).filter(Boolean);
  const firstAudience = audienceLabel(parts[0]);
  if (firstAudience && firstAudience !== rootAudience) {
    parts[0] = rootAudience;
    product.category = parts.join(" / ");
  }
}

function hasFootwearCompactText(value) {
  const text = compact(value)
    .replace(/handschoenen?/g, "")
    .replace(/sneeuwschoenen?/g, "")
    .replace(/schoenonderhoud/g, "");
  return /wandelschoenen?|bergschoenen?|trailrunschoenen?|damesschoenen?|herenschoenen?|kinderschoenen?|kidsschoenen?|winterschoenen?|lageschoenen?|halfhogeschoenen?|boots?|sandalen?|slippers?/.test(text);
}

function combinedCompact(product) {
  return `${product.categoryCompact || ""} ${product.productCompact || ""}`;
}

function hasDirectOrCompact(product, terms, pattern) {
  return hasAnyToken(product.categoryDirectTokens, terms) ||
    hasAnyToken(product.productDirectTokens, terms) ||
    (pattern ? pattern.test(combinedCompact(product)) : false);
}

function isWalkingFootwearProduct(product) {
  const text = combinedCompact(product);
  if (NON_WALKING_FOOTWEAR_RE.test(text)) return false;
  return hasAnyToken(product.categoryDirectTokens, WALKING_FOOTWEAR_TERMS) ||
    hasAnyToken(product.productDirectTokens, WALKING_FOOTWEAR_TERMS) ||
    WALKING_FOOTWEAR_RE.test(text);
}

function isTrailFootwearProduct(product) {
  const text = combinedCompact(product);
  if (NON_WALKING_FOOTWEAR_RE.test(text)) return false;
  return hasAnyToken(product.categoryDirectTokens, TRAIL_FOOTWEAR_TERMS) ||
    hasAnyToken(product.productDirectTokens, TRAIL_FOOTWEAR_TERMS) ||
    TRAIL_FOOTWEAR_RE.test(text);
}

function isRainPantsProduct(product) {
  const text = combinedCompact(product);
  return hasAnyToken(product.categoryDirectTokens, RAIN_PANTS_TERMS) ||
    hasAnyToken(product.productDirectTokens, RAIN_PANTS_TERMS) ||
    RAIN_PANTS_RE.test(text);
}

function isBackpackProduct(product) {
  const categoryText = product.categoryCompact || "";
  const productText = product.productCompact || "";
  if (NON_BACKPACK_RE.test(`${categoryText} ${productText}`)) return false;
  if (hasAnyToken(product.productDirectTokens, BACKPACK_TERMS) || BACKPACK_RE.test(productText)) return true;
  return hasAnyToken(product.categoryDirectTokens, BACKPACK_TERMS) || BACKPACK_RE.test(categoryText);
}

function refreshSearchText(product) {
  normalizeAudience(product);
  normalizeCategoryAudience(product);

  const productText = [product.title, product.brand, product.color, product.productId, product.article, product.barcode, product.groupId, product.sizes.join(" ")].join(" ");
  const visibleText = [product.title, product.brand, product.color, product.sizes.join(" "), product.root, product.category, product.categoryLeaf].join(" ");
  const idText = [product.productId, product.article, product.barcode, product.groupId].join(" ");
  const categoryText = [product.root, product.category, product.categoryLeaf, product.pathText].join(" ");
  const allText = `${productText} ${categoryText}`;

  product.titleNorm = normalize(product.title);
  product.titleCompact = compact(product.title);
  product.brandNorm = normalize(product.brand);
  product.categoryNorm = normalize(product.category);
  product.articleNorm = normalize(product.article);
  product.barcodeNorm = normalize(product.barcode);
  product.groupNorm = normalize(product.groupId);
  product.productIdCompact = compact(product.productId);
  product.articleCompact = compact(product.article);
  product.barcodeCompact = compact(product.barcode);
  product.groupCompact = compact(product.groupId);
  product.searchCompact = compact(allText);
  product.productCompact = compact(productText);
  product.visibleCompact = compact(visibleText);
  product.categoryCompact = compact(categoryText);
  product.allCompact = product.searchCompact;
  product.brandTokens = directTokenSet(product.brand);
  product.visibleDirectTokens = directTokenSet(visibleText);
  product.productDirectTokens = directTokenSet(productText);
  product.categoryDirectTokens = directTokenSet(categoryText);
  product.allDirectTokens = directTokenSet(allText);
  product.visibleTokens = tokenSet(visibleText);
  product.productTokens = tokenSet(productText);
  product.categoryTokens = tokenSet(categoryText);
  product.allTokens = tokenSet(allText);

  product._waterproofNonJacket = WATERPROOF_NON_JACKET_RE.test(`${product.productCompact} ${product.categoryCompact}`);
  product._hasJacketProductTerm = hasAnyToken(product.productDirectTokens, JACKET_TERMS) || JACKET_RE.test(product.productCompact || "");
  product._hasJacketCategoryTerm = hasAnyToken(product.categoryDirectTokens, JACKET_TERMS) || JACKET_RE.test(product.categoryCompact || "");
  product._hasJacketSignal = product._hasJacketCategoryTerm || product._hasJacketProductTerm;
  product._hasWaterproofJacketCategory = !product._waterproofNonJacket && product._hasJacketCategoryTerm && (hasAnyToken(product.categoryDirectTokens, WATERPROOF_TERMS) || WATERPROOF_RE.test(product.categoryCompact || ""));
  product._hasWaterproofProductTerm = !product._waterproofNonJacket && (hasAnyToken(product.productDirectTokens, WATERPROOF_TERMS) || WATERPROOF_RE.test(product.productCompact || ""));
  product._hasWaterproofJacketSignal = !product._waterproofNonJacket && product._hasJacketSignal && (product._hasWaterproofJacketCategory || product._hasWaterproofProductTerm);
  product._hasRainwearSignal = !product._waterproofNonJacket && (RAINWEAR_RE.test(product.categoryCompact || "") || (/regenjas|regenjack|regenbroek|hardshell|shelljas|poncho/.test(product.productCompact || "") && /kleding|jassen|broeken|regenkleding/.test(`${product.categoryCompact || ""} ${product.productCompact || ""}`)));
  product._nonJacketForJacketQuery = NON_JACKET_FOR_JACKET_QUERY_RE.test(`${product.productCompact} ${product.categoryCompact}`);
  product._hasFootwearSignal = hasAnyToken(product.categoryDirectTokens, FOOTWEAR_TERMS) || hasAnyToken(product.productDirectTokens, FOOTWEAR_TERMS) || hasFootwearCompactText(`${categoryText} ${productText}`);
  product._hasWalkingFootwearSignal = isWalkingFootwearProduct(product);
  product._hasTrailFootwearSignal = isTrailFootwearProduct(product);
  product._hasTrouserSignal = hasDirectOrCompact(product, TROUSER_TERMS, /broeken?|regenbroeken?|softshellbroek|pants|trousers|shorts?/);
  product._hasRainPantsSignal = isRainPantsProduct(product);
  product._hasFleeceSignal = hasDirectOrCompact(product, FLEECE_TERMS, /fleeces?/);
  product._hasBackpackSignal = isBackpackProduct(product);
  product._hasSoftshellSignal = hasDirectOrCompact(product, SOFTSHELL_TERMS, /softshells?/);
  product._hasHardshellSignal = hasDirectOrCompact(product, HARDSHELL_TERMS, /hardshells?|shelljassen?|goretex|gtx/);
  product._hasDownSignal = hasDirectOrCompact(product, DOWN_TERMS, /donsjassen?|downjacket|downjas/);
  product._hasSandalSignal = hasDirectOrCompact(product, SANDAL_TERMS, /sandalen?|slippers?/);
  product._preparedSearchIndex = PREPARED_VERSION;
  return product;
}

function productFromUrl(loc, index) {
  let parsed;
  try {
    parsed = new URL(loc);
  } catch {
    return null;
  }
  const pathname = parsed.pathname || "";
  if (!/\.html$/i.test(pathname)) return null;
  const segments = pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
  let last = segments[segments.length - 1] || "";
  const id = (last.match(/_([0-9]+)\.html(?:$|\?)/i) || [])[1] || "";
  last = last.replace(/\.html.*$/i, "");
  const colorMatch = last.match(/_([^_]+)_([0-9]+)$/);
  const color = colorMatch ? labelFromSlug(colorMatch[1]) : "";
  const slug = colorMatch ? last.slice(0, last.length - colorMatch[0].length) : last.replace(/_[0-9]+$/i, "");

  return {
    url: parsed.href,
    key: canonicalUrl(parsed.href),
    productId: id,
    title: labelFromSlug(slug) || labelFromSlug(segments[segments.length - 2]) || "Product",
    brand: "",
    color: isRealColor(color) ? color : "",
    root: audienceLabel(segments[0]),
    category: segments.slice(0, -1).map(labelFromSlug).filter(Boolean).join(" / "),
    categoryLeaf: labelFromSlug(segments[segments.length - 2] || segments[0]),
    pathText: segments.join(" "),
    sizes: [],
    image: "",
    price: "",
    oldPrice: "",
    stock: "",
    gender: "",
    article: "",
    barcode: "",
    groupId: "",
    lastmod: "",
    rank: index,
    source: "channable",
    enriched: true,
  };
}

function firstFeedValue(value) {
  if (Array.isArray(value)) {
    for (const item of value) {
      if (item !== null && typeof item !== "undefined" && String(item).trim()) return item;
    }
    return "";
  }
  return value;
}

function groupedFeedRows(rows) {
  const byUrl = new Map();
  for (const row of rows || []) {
    const url = firstFeedValue(row.link || row.url);
    const key = canonicalUrl(url);
    const availability = compact(firstFeedValue(row.availability));
    let stock = parseInt(firstFeedValue(row.stock), 10);
    let card;
    let price;
    let salePrice;
    let size;
    if (Number.isNaN(stock)) stock = /^(instock|opvoorraad|available)$/.test(availability) ? 1 : 0;
    if (!key || !url || stock <= 0 || /^(outofstock|nietopvoorraad|unavailable)$/.test(availability)) continue;
    card = byUrl.get(key);
    if (!card) {
      card = {
        title: firstFeedValue(row.title || row.title2),
        brand: firstFeedValue(row.brand),
        color: firstFeedValue(row.color),
        gender: firstFeedValue(row.gender),
        image: firstFeedValue(row.image_link || row.image || row.g_image_link),
        productType: firstFeedValue(row.product_type),
        article: firstFeedValue(row.mpn || row.g_mpn),
        barcode: firstFeedValue(row.barcode || row.gtin || row.g_barcode || row.g_gtin),
        groupId: firstFeedValue(row.item_group_id || row.g_item_group_id),
        feedId: firstFeedValue(row.id || row.g_id),
        url,
        priceRaw: firstFeedValue(row.price),
        saleRaw: firstFeedValue(row.sale_price),
        stock: 0,
        sizes: [],
      };
      byUrl.set(key, card);
    }
    card.stock += stock;
    price = priceAmount(firstFeedValue(row.price));
    salePrice = priceAmount(firstFeedValue(row.sale_price));
    if (Number.isFinite(price) && (!Number.isFinite(priceAmount(card.priceRaw)) || price < priceAmount(card.priceRaw))) card.priceRaw = firstFeedValue(row.price);
    if (Number.isFinite(salePrice) && (!Number.isFinite(priceAmount(card.saleRaw)) || salePrice < priceAmount(card.saleRaw))) card.saleRaw = firstFeedValue(row.sale_price);
    size = firstFeedValue(row.size || row.g_size);
    if (isRealSize(size) && !card.sizes.includes(size)) card.sizes.push(size);
  }
  return Array.from(byUrl.values());
}

function buildPreparedProducts(rows) {
  return groupedFeedRows(rows).map((extra, index) => {
    const product = productFromUrl(extra.url, index);
    let sale;
    let price;
    if (!product) return null;
    product.title = extra.title || product.title;
    product.brand = extra.brand || product.brand;
    product.color = isRealColor(extra.color) ? extra.color : product.color;
    product.gender = extra.gender || product.gender;
    product.root = audienceLabel(extra.gender) || product.root;
    product.image = extra.image || product.image;
    product.article = extra.article || product.article;
    product.barcode = extra.barcode || product.barcode;
    product.groupId = extra.groupId || product.groupId;
    product.productId = product.productId || String(extra.feedId || "").split("-")[0];
    product.stock = extra.sizes.length ? `${extra.sizes.length} maten` : "Op voorraad";
    product.sizes = extra.sizes.slice(0, 36);
    if (extra.productType) {
      const typeParts = String(extra.productType).split(/\s+/);
      product.category = typeParts.map(labelFromSlug).filter(Boolean).join(" / ");
      product.categoryLeaf = labelFromSlug(typeParts[typeParts.length - 1] || "");
      product.pathText += ` ${extra.productType}`;
    }
    sale = parsePrice(extra.saleRaw);
    price = parsePrice(extra.priceRaw);
    product.price = sale || price || product.price;
    product.oldPrice = sale && price && sale !== price ? price : "";
    return refreshSearchText(product);
  }).filter(Boolean);
}

async function upstreamResponse() {
  return fetch(CHANNABLE_FEED_URL, {
    headers: {
      "Accept": "application/json",
      "User-Agent": "SpacSportSearchIndexWorker/1.1",
    },
    cf: {
      cacheEverything: true,
      cacheTtl: CACHE_TTL_SECONDS,
    },
  });
}

function applyCors(response, request, extraHeaders = {}) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(corsHeaders(request))) headers.set(key, value);
  for (const [key, value] of Object.entries(extraHeaders)) headers.set(key, value);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function rawProductsResponse(request, method) {
  const upstream = await upstreamResponse();
  if (!upstream.ok) return jsonResponse({ error: "Upstream feed unavailable", status: upstream.status }, 502, request);

  const headers = new Headers(upstream.headers);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Cache-Control", "public, max-age=300, s-maxage=300, stale-while-revalidate=300");
  headers.set("X-Spac-Search-Proxy", "cloudflare-worker");
  headers.delete("Content-Disposition");
  for (const [key, value] of Object.entries(corsHeaders(request))) headers.set(key, value);

  return new Response(method === "HEAD" ? null : upstream.body, {
    status: upstream.status,
    headers,
  });
}

async function preparedResponse(request, env, ctx, method) {
  if (!PREPARED_BUILD_ENABLED) {
    return jsonResponse({
      error: "Prepared index builder disabled",
      reason: "Cloudflare Worker CPU limit is too low for building this index from the 13 MB feed at request time.",
      raw: "/products.json",
      required: "Use an external scheduled builder/static file, or enable this route on a Worker plan/runtime with enough CPU.",
    }, 503, request);
  }

  const cacheUrl = new URL(request.url);
  cacheUrl.pathname = "/prepared.json";
  cacheUrl.search = "";
  const cacheRequest = new Request(cacheUrl.toString(), { method: "GET" });
  const cache = typeof caches !== "undefined" ? caches.default : null;
  const cached = cache && method === "GET" ? await cache.match(cacheRequest) : null;
  if (cached) return applyCors(cached, request, { "X-Spac-Search-Cache": "HIT" });

  if (method === "HEAD") {
    return new Response(null, {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=300",
        "X-Spac-Search-Prepared": PREPARED_VERSION,
        ...corsHeaders(request),
      },
    });
  }

  const started = Date.now();
  const upstream = await upstreamResponse();
  if (!upstream.ok) return jsonResponse({ error: "Upstream feed unavailable", status: upstream.status }, 502, request);

  const rows = await upstream.json();
  const products = buildPreparedProducts(Array.isArray(rows) ? rows : (rows.products || rows.items || rows.data || []));
  const body = JSON.stringify({
    version: PREPARED_VERSION,
    generatedAt: new Date().toISOString(),
    productCount: products.length,
    products,
  });
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=300",
    "X-Spac-Search-Proxy": "cloudflare-worker",
    "X-Spac-Search-Prepared": PREPARED_VERSION,
    "X-Spac-Search-Products": String(products.length),
    "X-Spac-Search-Build-Ms": String(Date.now() - started),
    ...corsHeaders(request),
  };
  const response = new Response(body, { status: 200, headers });
  if (cache && ctx && ctx.waitUntil) ctx.waitUntil(cache.put(cacheRequest, response.clone()));
  return response;
}

export default {
  async fetch(request, env, ctx) {
    const method = request.method.toUpperCase();

    if (method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(request),
      });
    }

    if (method !== "GET" && method !== "HEAD") {
      return jsonResponse({ error: "Method not allowed" }, 405, request);
    }

    const url = new URL(request.url);
    if (url.pathname === "/" || url.pathname === "/products.json") {
      return rawProductsResponse(request, method);
    }
    if (url.pathname === "/prepared.json") {
      return preparedResponse(request, env, ctx, method);
    }
    return jsonResponse({ error: "Not found" }, 404, request);
  },
};
