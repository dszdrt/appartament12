import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { db } from "../src/lib/db";

async function main() {
  console.log("Deleting seeded reviews...");
  await db.review.deleteMany();
  console.log("All seeded reviews deleted successfully!");
}

main().catch(console.error);
