import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the complete Kalemati learning world", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Kalemati/);
  assert.match(html, /Six worlds, one connected curriculum/);
  assert.match(html, /First Sounds/);
  assert.match(html, /Young Writer/);
  assert.match(html, /Sentence Studio/);
  assert.match(html, /Color Studio/);
  assert.match(html, /Parent Space/);
  assert.match(html, /Meet a Teacher/);
  assert.match(html, /Test Centre/);
  assert.match(html, /Dictation Lab/);
  assert.match(html, /Level Compass/);
  assert.match(html, /كَلِماتي/);
  assert.doesNotMatch(html, /bird|hoopoe|mascot|duolingo/i);
});

test("ships levelled curriculum, persistence, and extensible content", async () => {
  const [page, curriculum, assessments, schema, hosting] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/curriculum.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/assessments.ts", import.meta.url), "utf8"),
    readFile(new URL("../db/schema.ts", import.meta.url), "utf8"),
    readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
  ]);

  assert.match(curriculum, /id:\s*6[\s\S]*cefr:\s*"B2"/);
  assert.match(curriculum, /export const sentenceExercises/);
  assert.match(curriculum, /export const coloringScenes/);
  assert.match(curriculum, /export const gameRounds/);
  const storyBlock = curriculum.match(
    /export const stories: Story\[\] = \[([\s\S]*?)\r?\n\];\r?\n\r?\nexport const coloringScenes/,
  )?.[1] ?? "";
  assert.equal((storyBlock.match(/\bid:/g) ?? []).length, 30);
  for (let level = 1; level <= 6; level += 1) {
    assert.equal(
      (storyBlock.match(new RegExp(`level: ${level}`, "g")) ?? []).length,
      5,
    );
  }
  assert.match(storyBlock, /id: "blue-door"/);
  assert.match(storyBlock, /id: "before-dawn"/);
  assert.match(page, /<canvas/);
  assert.match(page, /Content Studio/);
  assert.match(page, /renderTests/);
  assert.match(page, /renderDictation/);
  assert.match(page, /renderPlacement/);
  assert.match(page, /\/api\/learning/);
  assert.match(assessments, /export const assessmentQuestions/);
  assert.match(assessments, /export const dictationExercises/);
  assert.match(assessments, /export const placementQuestions/);
  assert.match(assessments, /placement-6b/);
  assert.match(schema, /export const learningProgress/);
  assert.match(schema, /export const artworks/);
  assert.match(schema, /export const contentItems/);
  assert.equal(JSON.parse(hosting).d1, "DB");
});
