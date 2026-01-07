import { Hono } from "npm:hono@4.3.11";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";
import * as kv from "./kv_store.tsx";
import { fetchAllCommodities, commodityMappings } from "./agmarknetService.tsx";

const app = new Hono();

app.use("*", cors());
app.use("*", logger(console.log));

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// Cache duration: 6 hours
const CACHE_DURATION = 6 * 60 * 60 * 1000;

// Initialize commodity data on server start
async function initializeCommodityData() {
  try {
    const cached = await kv.get("commodities_cache");
    const cacheTimestamp = await kv.get("commodities_cache_timestamp");
    
    const now = Date.now();
    const shouldRefresh = !cached || !cacheTimestamp || (now - cacheTimestamp) > CACHE_DURATION;
    
    if (shouldRefresh) {
      console.log("Refreshing commodity data from Agmarknet API...");
      const commodities = await fetchAllCommodities();
      await kv.set("commodities_cache", commodities);
      await kv.set("commodities_cache_timestamp", now);
      console.log(`Cached ${commodities.length} commodities`);
      return commodities;
    } else {
      console.log("Using cached commodity data");
      return cached;
    }
  } catch (error) {
    console.log(`Error initializing commodity data: ${error}`);
    return [];
  }
}

// Initialize data on startup (async, non-blocking)
initializeCommodityData().catch(err => console.log("Background init error:", err));

// Register new user
app.post("/make-server-0b8d9661/register", async (c) => {
  try {
    const { email, password, name, mobile } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Check if user already exists
    const existingUser = await kv.get(`user:${email}`);
    if (existingUser) {
      return c.json({ error: "User already exists" }, 400);
    }

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, mobile },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });

    if (error) {
      console.log(`Registration error for ${email}: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Store additional user data in KV store
    await kv.set(`user:${email}`, {
      id: data.user.id,
      email,
      name,
      mobile,
      createdAt: new Date().toISOString(),
    });

    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.log(`Registration error: ${error}`);
    return c.json({ error: "Registration failed" }, 500);
  }
});

// Login
app.post("/make-server-0b8d9661/login", async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: "Missing email or password" }, 400);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(`Login error for ${email}: ${error.message}`);
      return c.json({ error: "Invalid credentials" }, 401);
    }

    const userData = await kv.get(`user:${email}`);

    return c.json({
      success: true,
      accessToken: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: userData?.name || data.user.user_metadata?.name,
        mobile: userData?.mobile || data.user.user_metadata?.mobile,
      },
    });
  } catch (error) {
    console.log(`Login error: ${error}`);
    return c.json({ error: "Login failed" }, 500);
  }
});

// Get user session
app.get("/make-server-0b8d9661/session", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return c.json({ error: "No token provided" }, 401);
    }

    const { data, error } = await supabase.auth.getUser(accessToken);
    if (error || !data.user) {
      return c.json({ error: "Invalid session" }, 401);
    }

    const userData = await kv.get(`user:${data.user.email}`);

    return c.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        name: userData?.name || data.user.user_metadata?.name,
        mobile: userData?.mobile || data.user.user_metadata?.mobile,
      },
    });
  } catch (error) {
    console.log(`Session check error: ${error}`);
    return c.json({ error: "Session check failed" }, 500);
  }
});

// Get all crops
app.get("/make-server-0b8d9661/crops", async (c) => {
  try {
    // Get cached data
    const cached = await kv.get("commodities_cache");
    const cacheTimestamp = await kv.get("commodities_cache_timestamp");
    
    const now = Date.now();
    const shouldRefresh = !cached || !cacheTimestamp || (now - cacheTimestamp) > CACHE_DURATION;
    
    if (shouldRefresh) {
      console.log("Cache expired or not found, refreshing from API...");
      // Trigger background refresh
      initializeCommodityData().catch(err => console.log("Background refresh error:", err));
      
      // Return cached data if available, otherwise wait for fresh data
      if (cached) {
        return c.json({ crops: cached });
      } else {
        const commodities = await fetchAllCommodities();
        await kv.set("commodities_cache", commodities);
        await kv.set("commodities_cache_timestamp", now);
        return c.json({ crops: commodities });
      }
    }
    
    return c.json({ crops: cached || [] });
  } catch (error) {
    console.log(`Error fetching crops: ${error}`);
    return c.json({ error: "Failed to fetch crops" }, 500);
  }
});

// Get single crop detail
app.get("/make-server-0b8d9661/crops/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const cached = await kv.get("commodities_cache");
    
    if (!cached || !Array.isArray(cached)) {
      return c.json({ error: "Crop data not available" }, 404);
    }
    
    const crop = cached.find((c: any) => c.id === id);
    
    if (!crop) {
      return c.json({ error: "Crop not found" }, 404);
    }

    return c.json({ crop });
  } catch (error) {
    console.log(`Error fetching crop detail: ${error}`);
    return c.json({ error: "Failed to fetch crop detail" }, 500);
  }
});

// Save notification settings
app.post("/make-server-0b8d9661/notifications", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { mobile, selectedCrops } = await c.req.json();

    await kv.set(`notifications:${user.id}`, {
      userId: user.id,
      mobile,
      selectedCrops,
      updatedAt: new Date().toISOString(),
    });

    return c.json({ success: true });
  } catch (error) {
    console.log(`Error saving notification settings: ${error}`);
    return c.json({ error: "Failed to save settings" }, 500);
  }
});

// Get notification settings
app.get("/make-server-0b8d9661/notifications", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const settings = await kv.get(`notifications:${user.id}`);

    return c.json({ settings: settings || { mobile: "", selectedCrops: [] } });
  } catch (error) {
    console.log(`Error fetching notification settings: ${error}`);
    return c.json({ error: "Failed to fetch settings" }, 500);
  }
});

Deno.serve(app.fetch);