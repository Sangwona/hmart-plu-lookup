import { supabase } from "./supabase.js";

async function testDatabase() {
  try {
    console.log("Testing database connection...");

    // Test categories
    const { data: categories, error: catError } = await supabase
      .from("categories")
      .select("*");

    if (catError) {
      console.error("Error fetching categories:", catError);
    } else {
      console.log("Categories:", categories);
    }

    // Test produce items
    const { data: items, error: itemError } = await supabase
      .from("produce_items")
      .select("*");

    if (itemError) {
      console.error("Error fetching produce items:", itemError);
    } else {
      console.log("Produce items:", items);
    }

    console.log("Database test completed.");
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testDatabase();
