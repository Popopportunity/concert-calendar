const fs = require("fs");
const https = require("https");
const path = require("path");

const ROOT = process.cwd();
const SOURCES_PATH = path.join(ROOT, "data", "collection-sources.json");
const PENDING_PATH = path.join(ROOT, "data", "pending-events.json");
const REPORT_PATH = path.join(ROOT, "data", "collection-report.md");
const APP_PATH = path.join(ROOT, "app.js");

const BLOCKED_RE = /音乐节|音樂節|festival|拼盘|拼盤|群星|嘉年华音乐节/i;
const CONCERT_RE = /演唱会|演唱會|巡回演唱|巡迴演唱|concert/i;

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function main() {
  const sources = readJson(SOURCES_PATH, []);
  const pending = readJson(PENDING_PATH, {
    schemaVersion: 1,
    reviewPolicy: "Candidates are collected for manual review only. They are not shown on the public calendar until approved.",
    candidates: []
  });
  const approvedKeys = readApprovedKeys();
  const existingKeys = new Set((pending.candidates || []).map((candidate) => getEventKey(candidate)));
  const nextCandidates = [...(pending.candidates || [])];
  const reportLines = [
    "# Concert Candidate Collection",
    "",
    "This PR contains automatically collected candidates for manual review.",
    "",
    "- Only merge approved entries into the public calendar.",
    "- Reject music festivals, variety lineups, rumors, and unclear venue listings.",
    "- Damai pages can be dynamically rendered, so candidates may need manual verification.",
    ""
  ];
  let addedCount = 0;

  for (const source of sources) {
    reportLines.push(`## ${source.name}`);
    reportLines.push("");
    try {
      const html = await fetchText(source.url);
      const candidates = extractCandidates(html, source);
      const accepted = [];

      for (const candidate of candidates) {
        const key = getEventKey(candidate);
        if (!key || approvedKeys.has(key) || existingKeys.has(key)) continue;
        existingKeys.add(key);
        nextCandidates.push(candidate);
        accepted.push(candidate);
        addedCount += 1;
      }

      if (!accepted.length) {
        reportLines.push("No new candidates found from this source.");
      } else {
        for (const candidate of accepted) {
          reportLines.push(`- ${candidate.date || "日期待核"} ${candidate.artist || "艺人待核"} · ${candidate.city || "城市待核"} · ${candidate.venue || "场馆待核"} · ${candidate.tour || "巡演待核"}`);
          reportLines.push(`  - Source: ${candidate.sourceUrl}`);
          reportLines.push(`  - Confidence: ${candidate.confidence}`);
        }
      }
    } catch (error) {
      reportLines.push(`Failed to collect this source: ${error.message}`);
    }
    reportLines.push("");
  }

  if (!addedCount) {
    console.log("No new candidates found.");
    return;
  }

  const nextPending = {
    schemaVersion: 1,
    reviewPolicy: pending.reviewPolicy || "Candidates are collected for manual review only. They are not shown on the public calendar until approved.",
    candidates: sortCandidates(nextCandidates)
  };

  writeJsonIfChanged(PENDING_PATH, nextPending);
  fs.writeFileSync(REPORT_PATH, `${reportLines.join("\n").trim()}\n`, "utf8");
  console.log(`Added ${addedCount} candidate(s) for review.`);
}

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJsonIfChanged(filePath, value) {
  const next = `${JSON.stringify(value, null, 2)}\n`;
  const current = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
  if (current !== next) fs.writeFileSync(filePath, next, "utf8");
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(
      url,
      {
        headers: {
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
          "User-Agent": "Mozilla/5.0 (compatible; ConcertCalendarBot/1.0; +https://github.com/Popopportunity/concert-calendar)"
        },
        timeout: 20000
      },
      (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          resolve(fetchText(new URL(response.headers.location, url).toString()));
          response.resume();
          return;
        }
        if (response.statusCode < 200 || response.statusCode >= 300) {
          reject(new Error(`HTTP ${response.statusCode}`));
          response.resume();
          return;
        }
        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => resolve(body));
      }
    );
    request.on("timeout", () => {
      request.destroy(new Error("Request timed out"));
    });
    request.on("error", reject);
  });
}

function extractCandidates(html, source) {
  const candidates = [];
  candidates.push(...extractJsonLdCandidates(html, source));
  candidates.push(...extractTextCandidates(html, source));
  return dedupeCandidates(candidates);
}

function extractJsonLdCandidates(html, source) {
  const matches = html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  const candidates = [];

  for (const match of matches) {
    try {
      const parsed = JSON.parse(stripHtmlEntities(match[1].trim()));
      const items = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of flattenJsonLd(items)) {
        const type = Array.isArray(item["@type"]) ? item["@type"].join(" ") : item["@type"];
        if (!/event/i.test(String(type || ""))) continue;
        const name = String(item.name || "");
        if (!CONCERT_RE.test(name) || BLOCKED_RE.test(name)) continue;
        const venue = item.location && typeof item.location === "object" ? item.location.name : "";
        const city = item.location && item.location.address && typeof item.location.address === "object" ? item.location.address.addressLocality : "";
        const date = normalizeDate(item.startDate || item.startTime || "");
        candidates.push(makeCandidate({
          date,
          artist: inferArtist(name),
          city,
          venue,
          tour: name,
          source,
          confidence: "medium"
        }));
      }
    } catch {
      // Ignore malformed JSON-LD blocks.
    }
  }

  return candidates;
}

function flattenJsonLd(items) {
  const output = [];
  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    output.push(item);
    if (Array.isArray(item["@graph"])) output.push(...flattenJsonLd(item["@graph"]));
  }
  return output;
}

function extractTextCandidates(html, source) {
  const text = htmlToText(html);
  if (!CONCERT_RE.test(text) || BLOCKED_RE.test(text)) return [];
  const title = extractTitle(html);
  const date = normalizeDate((text.match(/20\d{2}[.\/-]\d{1,2}[.\/-]\d{1,2}/) || [])[0] || "");
  const venue = ((text.match(/[\u4e00-\u9fa5A-Za-z0-9（）()·-]{2,35}(体育场|体育馆|演艺中心|综艺馆|剧院|中心)/) || [])[0] || "").trim();
  const city = inferCity(text, venue);
  const tour = CONCERT_RE.test(title) ? title : (text.match(/[\u4e00-\u9fa5A-Za-z0-9（）()·\- ]{2,60}(演唱会|演唱會)/) || [])[0] || title;

  if (!date && !venue && !tour) return [];
  return [
    makeCandidate({
      date,
      artist: inferArtist(tour),
      city,
      venue,
      tour,
      source,
      confidence: date && venue ? "low" : "needs-manual-check"
    })
  ];
}

function makeCandidate({ date, artist, city, venue, tour, source, confidence }) {
  const candidate = {
    id: stableId([date, artist, city, venue, tour, source.url]),
    date: date || "",
    artist: cleanText(artist),
    city: cleanText(city),
    venue: cleanText(venue),
    tour: cleanText(tour),
    sourcePlatform: source.platform || "unknown",
    sourceName: source.name,
    sourceUrl: source.url,
    status: "pending",
    confidence
  };
  return candidate;
}

function htmlToText(html) {
  return stripHtmlEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
  );
}

function extractTitle(html) {
  return cleanText(stripHtmlEntities((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || ""));
}

function stripHtmlEntities(text) {
  return String(text)
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function cleanText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/_【.*?】.*$/, "")
    .trim();
}

function inferArtist(title) {
  const cleaned = cleanText(title);
  const match = cleaned.match(/^([\u4e00-\u9fa5A-Za-z0-9·.\- ]{2,20}).*?(演唱会|演唱會|巡回|巡迴)/);
  return match ? cleanText(match[1]) : "";
}

function inferCity(text, venue) {
  const haystack = `${venue} ${text}`;
  const knownCities = ["北京", "上海", "广州", "深圳", "杭州", "成都", "重庆", "天津", "南京", "武汉", "西安", "长沙", "南昌", "青岛", "厦门", "福州", "合肥", "沈阳", "太原", "苏州", "南宁", "澳门"];
  return knownCities.find((city) => haystack.includes(city)) || "";
}

function normalizeDate(value) {
  const match = String(value || "").match(/(20\d{2})[.\/-](\d{1,2})[.\/-](\d{1,2})/);
  if (!match) return "";
  return `${match[1]}-${match[2].padStart(2, "0")}-${match[3].padStart(2, "0")}`;
}

function readApprovedKeys() {
  if (!fs.existsSync(APP_PATH)) return new Set();
  const app = fs.readFileSync(APP_PATH, "utf8");
  const rowsMatch = app.match(/const officialRows = \[([\s\S]*?)\];/);
  if (!rowsMatch) return new Set();
  const rowMatches = [...rowsMatch[1].matchAll(/\{\s*dateText:\s*"([^"]+)",\s*artist:\s*"([^"]+)",\s*tour:\s*"([^"]+)",\s*venue:\s*"([^"]+)",\s*city:\s*"([^"]+)"/g)];
  const keys = new Set();
  for (const match of rowMatches) {
    for (const date of expandDateText(match[1])) {
      keys.add(getEventKey({ date, artist: match[2], tour: match[3], venue: match[4], city: match[5] }));
    }
  }
  return keys;
}

function expandDateText(dateText) {
  return String(dateText)
    .split("、")
    .flatMap((part) => {
      const normalized = part.trim();
      if (!normalized) return [];
      if (!normalized.includes("-")) return [normalizeDate(normalized)];
      const [startText, endText] = normalized.split("-").map((value) => value.trim());
      const dates = [];
      const current = parseDateText(startText);
      const end = parseDateText(endText);
      while (current <= end) {
        dates.push(formatDate(current));
        current.setDate(current.getDate() + 1);
      }
      return dates;
    })
    .filter(Boolean);
}

function parseDateText(value) {
  const [year, month, day] = String(value).split(".").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function getEventKey(event) {
  return [event.date, event.artist, event.city, event.venue, event.tour]
    .map((value, index) => (index === 0 ? String(value || "").trim() : normalizeEventText(value)))
    .join("|");
}

function normalizeEventText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s·.。()（）\-—_《》「」“”"'：:]+/g, "");
}

function dedupeCandidates(candidates) {
  const seen = new Set();
  return candidates.filter((candidate) => {
    const key = getEventKey(candidate);
    if (seen.has(key)) return false;
    seen.add(key);
    return CONCERT_RE.test(candidate.tour) && !BLOCKED_RE.test(`${candidate.artist} ${candidate.tour} ${candidate.venue}`);
  });
}

function sortCandidates(candidates) {
  return [...candidates].sort((a, b) =>
    String(a.date || "9999").localeCompare(String(b.date || "9999")) ||
    String(a.artist).localeCompare(String(b.artist), "zh-Hans-CN")
  );
}

function stableId(parts) {
  const input = parts.map((part) => normalizeEventText(part)).join("|");
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }
  return `candidate-${hash.toString(16)}`;
}
