// Supabase configuration and client setup
// Configuration is loaded from config.js
const supabaseUrl = window.SUPABASE_CONFIG?.url;
const supabaseKey = window.SUPABASE_CONFIG?.anonKey;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase configuration not found. Please check config.js");
}

// For browser environment, use global supabase from CDN
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Export for ES6 modules
export { supabase };

// Make it available globally for HTML script tags
window.supabase = supabase;
