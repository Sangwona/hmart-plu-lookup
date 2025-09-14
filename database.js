// Database module for Supabase integration
import { supabase } from "./supabase.js";

class DatabaseManager {
  constructor() {
    // No longer using local mock data - using Supabase
  }

  async getProduceItems() {
    const { data, error } = await supabase
      .from("produce_items")
      .select("*")
      .order("name");
    if (error) throw error;
    return data;
  }

  async addProduceItem(item) {
    const { data, error } = await supabase
      .from("produce_items")
      .insert(item)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateProduceItem(id, updates) {
    const { data, error } = await supabase
      .from("produce_items")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteProduceItem(id) {
    const { data, error } = await supabase
      .from("produce_items")
      .delete()
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // Utility methods for compatibility with existing code
  async getLocalProduceItems() {
    return await this.getProduceItems();
  }

  async getLocalCategories() {
    return []; // Return empty array since categories are no longer used
  }

  // These methods are no longer needed as we use Supabase
  setLocalProduceItems(items) {
    // No-op
  }

  setLocalCategories(categories) {
    // No-op
  }
}

// Export for use in other modules
const dbManager = new DatabaseManager();

// Make it available globally for HTML script tags
window.dbManager = dbManager;
