import test from "node:test";
import assert from "node:assert/strict";
import {
  evaluateLead,
  isDottedGmail,
  isRandomName,
  MIN_FILL_MS,
} from "../src/lib/leads/spam.ts";

const human = { _hp: "", _elapsed: MIN_FILL_MS + 5000 };

test("nombres aleatorios de los bots", () => {
  assert.equal(isRandomName("RTGxfdZRBzDJltWEBavWvpUE"), true);
  assert.equal(isRandomName("ESJvMzgRjeedmKeYuszWPwn"), true);
  assert.equal(isRandomName("María José Benítez"), false);
  assert.equal(isRandomName("MacDonald"), false);
  assert.equal(isRandomName("Jonathan"), false);
});

test("gmail con puntos intercalados", () => {
  assert.equal(isDottedGmail("e.t.o.zuj.at8.10@gmail.com"), true);
  assert.equal(isDottedGmail("c.am.p.be.l.l.ajk@gmail.com"), true);
  assert.equal(isDottedGmail("juan.perez@gmail.com"), false);
  assert.equal(isDottedGmail("a.b.c.d@empresa.com"), false);
  assert.equal(isDottedGmail(null), false);
});

test("campo trampa completo se descarta", () => {
  const v = evaluateLead({ fullName: "Ana", guard: { ...human, _hp: "x" } });
  assert.deepEqual(v, { kind: "drop", reason: "honeypot" });
});

test("envío sin datos del formulario o demasiado rápido se descarta", () => {
  assert.equal(evaluateLead({ fullName: "Ana", guard: {} }).kind, "drop");
  assert.equal(
    evaluateLead({ fullName: "Ana", guard: { _hp: "", _elapsed: 400 } }).kind,
    "drop",
  );
});

test("lead sospechoso se guarda marcado, uno normal pasa", () => {
  assert.equal(
    evaluateLead({ fullName: "dkerFeorRgDXcqtZHrYVnEUH", guard: human }).kind,
    "suspicious",
  );
  assert.equal(
    evaluateLead({
      fullName: "Ana",
      email: "he.qezi.da.56.8@gmail.com",
      guard: human,
    }).kind,
    "suspicious",
  );
  assert.equal(
    evaluateLead({
      fullName: "Laura Gómez",
      email: "laura.gomez@gmail.com",
      guard: human,
    }).kind,
    "ok",
  );
});
