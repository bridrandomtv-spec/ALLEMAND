import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("administrative review mockup remains isolated and visibly synthetic", async () => {
  const html = await readFile(new URL("./registry-review-preview.html", import.meta.url), "utf8");
  assert.match(html, /بيانات وهمية فقط/);
  assert.match(html, /لا توجد قاعدة بيانات أو شبكة أو حفظ دائم/);
  assert.match(html, /SYN-OR-001/);
  assert.match(html, /SYN-OR-004/);
  assert.doesNotMatch(html, /\bfetch\s*\(/);
  assert.doesNotMatch(html, /localStorage|sessionStorage|indexedDB/);
  assert.match(html, /يجب أن يختلف المراجع الثاني عن الموظف/);
  assert.match(html, /لا توجد موافقة رسمية أو حفظ دائم/);
});
