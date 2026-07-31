// SERVER-ONLY: SQLite connection, schema and initialization.
// This module must never be imported by client code — it is only reachable
// through TanStack Start server functions (see ./api.ts) and route loaders.
//
// better-sqlite3 is a native Node addon, so it runs in the Vite dev SSR
// process (Node) but NOT in the Cloudflare production build target. This is
// the intended setup for the MVP: real relational persistence in development.
import "@tanstack/react-start/server-only";
import path from "node:path";
import fs from "node:fs";
import Database from "better-sqlite3";
import type { Database as DB } from "better-sqlite3";
import { runSeed } from "./seed";

let dbInstance: DB | null = null;

function resolveDbPath(): string {
  const dir = path.resolve(process.cwd(), "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, "undf.sqlite");
}

function applySchema(db: DB) {
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS schools (
      id   TEXT PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS courses (
      id        TEXT PRIMARY KEY,
      school_id TEXT NOT NULL REFERENCES schools(id),
      name      TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS subjects (
      id        TEXT PRIMARY KEY,
      course_id TEXT NOT NULL REFERENCES courses(id),
      name      TEXT NOT NULL,
      semester  TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS professionals (
      id       TEXT PRIMARY KEY,
      name     TEXT NOT NULL,
      role     TEXT NOT NULL,
      crp      TEXT,
      initials TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS students (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      email       TEXT NOT NULL,
      cpf         TEXT NOT NULL,
      matricula   TEXT NOT NULL,
      course_id   TEXT NOT NULL REFERENCES courses(id),
      turma       TEXT NOT NULL,
      attendance  INTEGER NOT NULL,
      gpa         REAL NOT NULL,
      risk        TEXT NOT NULL,
      pcd         INTEGER NOT NULL DEFAULT 0,
      pcd_type    TEXT,
      benefits    TEXT,
      is_current  INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS grades (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id  TEXT NOT NULL REFERENCES students(id),
      subject_id  TEXT NOT NULL REFERENCES subjects(id),
      semester    TEXT NOT NULL,
      grade       REAL NOT NULL,
      attendance  INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id             TEXT PRIMARY KEY,
      student_id     TEXT NOT NULL,
      professional_id TEXT NOT NULL REFERENCES professionals(id),
      date           TEXT NOT NULL,
      time           TEXT NOT NULL,
      modality       TEXT NOT NULL,
      status         TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      val TEXT NOT NULL
    );
  `);

  // Conflict prevention: one professional cannot be booked twice on the
  // same date + time slot. This enforces "no duplicate appointment with the
  // same professional, on the same day, at the same time".
  db.exec(`
    CREATE UNIQUE INDEX IF NOT EXISTS uniq_professional_slot
      ON appointments (professional_id, date, time);
  `);
}

export function getDb(): DB {
  if (dbInstance) return dbInstance;
  const db = new Database(resolveDbPath());
  applySchema(db);
  runSeed(db);
  dbInstance = db;
  return db;
}
