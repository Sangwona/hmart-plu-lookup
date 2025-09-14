import pkg from "pg";
const { Client } = pkg;
import fs from "fs";

const connectionString =
  "postgresql://postgres.hpcogbthbpxcjdwvygtp:rkawkthaltkddnjs@aws-1-us-east-2.pooler.supabase.com:5432/postgres";

async function runMigration() {
  const client = new Client({ connectionString });

  try {
    console.log("Connecting to database...");
    await client.connect();
    console.log("Connected successfully.");

    // Read the migration SQL file
    const sql = fs.readFileSync(
      "supabase/migrations/20250914032700_create_tables.sql",
      "utf8"
    );

    console.log("Executing migration SQL...");
    await client.query(sql);
    console.log("Migration SQL executed successfully.");

    console.log("Migration completed.");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await client.end();
    console.log("Database connection closed.");
  }
}

runMigration();
