import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("Lot 318 timeline is an isolated RTL mockup with synthetic-only data", async () => {
  const html = await readFile(new URL("./registry-decision-timeline-preview.html", import.meta.url), "utf8");
  assert.match(html, /<html lang="ar" dir="rtl">/);
  assert.match(html, /بيانات وهمية فقط/);
  assert.match(html, /SYN-CASE-01/);
  assert.match(html, /SYN-CASE-02/);
  assert.match(html, /DEMO-HASH/);
  assert.match(html, /تصدير عرض JSON/);
  assert.match(html, /id="ledger-file"/);
  assert.match(html, /crypto\.subtle/);
  assert.match(html, /startsWith\("SYN-"\)/);
  assert.match(html, /نجح التحقق من سلسلة SHA-256/);
  assert.doesNotMatch(html, /\bfetch\s*\(/);
  assert.doesNotMatch(html, /localStorage|sessionStorage|indexedDB/);
  assert.doesNotMatch(html, /supabase|createClient|Authorization/i);
  assert.doesNotMatch(html, /<script[^>]+src=/i);
  assert.match(html, /URL\.createObjectURL/);
  assert.match(html, /textContent/);
  assert.match(html, /البصمات المعروضة رموز اصطناعية/);
});
