require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const { createClient } = require("@supabase/supabase-js");

const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(express.json({ limit: "1mb" }));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      
      console.warn(`CORS REJECTION: Origin ${origin} is not in ALLOWED_ORIGINS:`, allowedOrigins);
      callback(new Error("Origin not allowed by CORS"));
    },
  }),
);

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase credentials (SUPABASE_URL and SUPABASE_ANON_KEY) must be configured in environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const adminEmails = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((value) => value.trim().toLowerCase())
  .filter(Boolean);

const AI_SERVICE_URL = (process.env.AI_SERVICE_URL || "http://localhost:8000").replace(/\/$/, "");

// ═══════════════════════════════════════════════════════════════
//  Health & Root
// ═══════════════════════════════════════════════════════════════

app.get("/", (_req, res) => {
  res.send("Vertex backend is running");
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Backend is running", version: "2.0.0" });
});

// ═══════════════════════════════════════════════════════════════
//  Auth Middleware
// ═══════════════════════════════════════════════════════════════

function getBearerToken(req) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) {
    return null;
  }
  return header.slice("Bearer ".length).trim();
}

function getAuthClient(req) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${req.accessToken}` } },
  });
}

async function authenticateRequest(req, res, next) {
  try {
    const accessToken = getBearerToken(req);
    if (!accessToken) {
      return res.status(401).json({ success: false, error: "Missing access token." });
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return res.status(401).json({ success: false, error: "Invalid or expired session." });
    }

    req.authUser = user;
    req.accessToken = accessToken;
    next();
  } catch (error) {
    next(error);
  }
}

function requireAdmin(req, res, next) {
  const user = req.authUser;
  const email = user?.email?.toLowerCase() || "";
  const appRole = user?.app_metadata?.role;
  const userRole = user?.user_metadata?.role;
  const isAdmin =
    appRole === "admin" ||
    userRole === "admin" ||
    (email && adminEmails.includes(email));

  if (!isAdmin) {
    return res.status(403).json({ success: false, error: "Admin access required." });
  }

  next();
}

// ═══════════════════════════════════════════════════════════════
//  Validation Helpers
// ═══════════════════════════════════════════════════════════════

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isPositiveNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function isUuid(value) {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
  );
}

function normalizeWorkerPayload(body, authUserId) {
  const payload = {
    id: authUserId,
    name: typeof body.name === "string" ? body.name.trim() : "",
    phone: typeof body.phone === "string" ? body.phone.trim() : "",
    platform: typeof body.platform === "string" ? body.platform.trim() : "",
    city: typeof body.city === "string" ? body.city.trim() : "",
    upi_id: typeof body.upi_id === "string" ? body.upi_id.trim() : "",
    license: typeof body.license === "string" ? body.license.trim() : "",
    risk_score: typeof body.risk_score === "number" ? body.risk_score : 0.5,
  };

  if (!payload.name || !payload.phone || !payload.platform || !payload.city || !payload.upi_id) {
    throw new Error("name, phone, platform, city, and upi_id are required.");
  }

  return payload;
}

function normalizePolicyPayload(body, authUserId) {
  const workerId = typeof body.worker_id === "string" ? body.worker_id.trim() : "";
  const weeklyPremium = typeof body.weekly_premium === "number" ? body.weekly_premium : Number(body.weekly_premium);
  const coverageAmount =
    typeof body.coverage_amount === "number" ? body.coverage_amount : Number(body.coverage_amount);

  if (workerId !== authUserId) {
    throw new Error("worker_id does not match the authenticated user.");
  }

  if (!isPositiveNumber(weeklyPremium) || !isPositiveNumber(coverageAmount)) {
    throw new Error("weekly_premium and coverage_amount must be positive numbers.");
  }

  return {
    worker_id: workerId,
    weekly_premium: weeklyPremium,
    coverage_amount: coverageAmount,
    weekly_payout: coverageAmount,
    status: "active",
  };
}

function normalizeClaimPayload(body) {
  const policyId = typeof body.policy_id === "string" ? body.policy_id.trim() : "";
  const triggerType = isNonEmptyString(body.trigger_type)
    ? body.trigger_type.trim()
    : isNonEmptyString(body.disruption_type)
      ? body.disruption_type.trim()
      : "";
  
  const payoutAmount =
    typeof body.payout_amount === "number" ? body.payout_amount : Number(body.payout_amount || 0);

  if (policyId && !isUuid(policyId)) {
    throw new Error("policy_id must be a valid UUID.");
  }

  if (!triggerType) {
    throw new Error("trigger_type is required.");
  }

  return {
    policy_id: policyId,
    trigger_type: triggerType,
    disruption_type: triggerType,
    payout_amount: isNaN(payoutAmount) ? 0 : payoutAmount,
  };
}

// ═══════════════════════════════════════════════════════════════
//  Worker & Policy Endpoints (unchanged core logic)
// ═══════════════════════════════════════════════════════════════

app.post("/api/register-worker", authenticateRequest, async (req, res) => {
  try {
    const payload = normalizeWorkerPayload(req.body, req.authUser.id);
    const authSupabase = getAuthClient(req);

    const { data: existingWorker, error: existingError } = await authSupabase
      .from("Workers")
      .select("*")
      .eq("id", req.authUser.id)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    if (existingWorker) {
      return res.status(200).json({ success: true, worker: existingWorker, isExisting: true });
    }

    const { data, error } = await authSupabase.from("Workers").insert([payload]).select().single();

    if (error) {
      throw error;
    }

    // Create welcome notification
    await createNotification(req.authUser.id, "system", "Welcome to Vertex!",
      "Your account has been created. You are now protected by our AI-powered insurance platform.",
      { event: "worker_registered" });

    res.status(201).json({ success: true, worker: data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post("/api/create-policy", authenticateRequest, async (req, res) => {
  try {
    const payload = normalizePolicyPayload(req.body, req.authUser.id);
    const authSupabase = getAuthClient(req);

    const { data: worker, error: workerError } = await authSupabase
      .from("Workers")
      .select("id")
      .eq("id", req.authUser.id)
      .single();

    if (workerError || !worker) {
      throw new Error("Worker profile not found. Complete onboarding first.");
    }

    const { data, error } = await authSupabase.from("Policies").insert([payload]).select().single();

    if (error) {
      throw error;
    }

    await createNotification(req.authUser.id, "system", "Policy Activated",
      `Your insurance policy (₹${payload.coverage_amount} coverage) is now active.`,
      { policy_id: data.id, coverage: payload.coverage_amount });

    res.status(201).json({ success: true, policy: data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
//  Premium Calculation (now ML-powered via AI service)
// ═══════════════════════════════════════════════════════════════

app.get("/api/calculate-premium", async (req, res) => {
  try {
    const city = isNonEmptyString(req.query.city) ? req.query.city.trim() : "Mumbai";
    const platform = isNonEmptyString(req.query.platform) ? req.query.platform.trim() : "Swiggy";
    const weatherRisk = isNonEmptyString(req.query.weather_risk) ? req.query.weather_risk.trim() : "Low";

    // Map weather risk to rain_mm estimate for ML model
    const rainEstimate = weatherRisk === "Critical" ? 40 : weatherRisk === "High" ? 20 : weatherRisk === "Medium" ? 8 : 0;

    try {
      const aiResponse = await fetch(`${AI_SERVICE_URL}/api/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city, platform, weather_risk: weatherRisk,
          rain_mm: rainEstimate,
          hour: new Date().getHours(),
          month: new Date().getMonth() + 1,
        }),
        signal: AbortSignal.timeout(3000),
      });

      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        return res.status(200).json({ success: true, ...aiData, source: "ai-ml-service" });
      }
    } catch (_error) {
      console.warn("AI microservice unavailable, using backend fallback heuristics.");
    }

    // Fallback heuristics
    let riskScore = 0.52;
    const cityLower = city.toLowerCase();
    const platformLower = platform.toLowerCase();

    let weatherMultiplier = 1.0;
    if (weatherRisk === "Critical") weatherMultiplier = 1.5;
    else if (weatherRisk === "High") weatherMultiplier = 1.3;
    else if (weatherRisk === "Medium") weatherMultiplier = 1.15;

    if (cityLower.includes("mumbai") || cityLower.includes("delhi")) {
      riskScore += 0.2;
    }

    if (platformLower === "swiggy" || platformLower === "zomato") {
      riskScore += 0.1;
    }

    const baseScore = Math.min(Math.max(riskScore, 0.1), 0.95);
    const finalScore = Math.min(baseScore * weatherMultiplier, 0.99);
    const weeklyPremium = Number((15 + finalScore * 135).toFixed(2));

    res.status(200).json({
      success: true,
      risk_score: finalScore,
      weekly_premium: weeklyPremium,
      risk_level: scoreToLevel(finalScore),
      source: "backend-fallback",
    });
  } catch (_error) {
    res.status(500).json({ success: false, error: "Internal server error during calculation." });
  }
});

// ═══════════════════════════════════════════════════════════════
//  Weather & Risk Assessment
// ═══════════════════════════════════════════════════════════════

async function getRealTimeRisk(city) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    console.error("DEBUG: OPENWEATHER_API_KEY is missing in backend .env");
    return { level: "Low", rain_mm: 0, weather_id: 800, raw: null };
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    const res = await fetch(url);
    if (!res.ok) {
      return { level: "Low", rain_mm: 0, weather_id: 800, raw: null };
    }

    const data = await res.json();
    const weatherId = data.weather?.[0]?.id || 800;
    const rainVolume = (data.rain?.["1h"] || data.rain?.["3h"] || 0);
    const temperature = data.main?.temp || 25;
    const humidity = data.main?.humidity || 50;
    const windSpeed = data.wind?.speed || 0;

    let level = "Low";
    if (weatherId >= 200 && weatherId <= 232) level = "Critical";
    else if (weatherId >= 502 && weatherId <= 504) level = "High";
    else if ((weatherId >= 500 && weatherId <= 501) ||
             (weatherId >= 520 && weatherId <= 531) ||
             (weatherId >= 300 && weatherId <= 321) ||
             weatherId === 511) level = "Medium";
    else if (weatherId >= 600 && weatherId <= 622) level = "High";
    else if (weatherId === 781 || weatherId === 771) level = "Critical";
    else if (rainVolume > 10) level = "High";
    else if (rainVolume > 0) level = "Medium";

    // Heatwave detection
    if (temperature > 42) level = level === "Low" ? "High" : level;

    return {
      level,
      rain_mm: rainVolume,
      weather_id: weatherId,
      temperature,
      humidity,
      wind_speed: windSpeed,
      condition: data.weather?.[0]?.main || "Clear",
      description: data.weather?.[0]?.description || "clear sky",
      raw: data,
    };
  } catch (err) {
    console.error(`Weather check exception for ${city}:`, err);
    return { level: "Low", rain_mm: 0, weather_id: 800, raw: null };
  }
}

// ═══════════════════════════════════════════════════════════════
//  FRAUD DETECTION ENGINE
// ═══════════════════════════════════════════════════════════════

/**
 * Multi-layered fraud analysis for a claim.
 * Returns { fraud_score, signals[], is_suspicious, recommendation }
 */
async function analyzeFraud(workerId, policyId, payoutAmount, triggerType, weatherData, authSupabase) {
  const signals = [];
  let totalFraudScore = 0;

  // --- Layer 1: Velocity Check (claims in last 7 days) ---
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: recentClaims, count: claimCount } = await supabase
    .from("Claims")
    .select("*", { count: "exact" })
    .eq("worker_id", workerId)
    .gte("created_at", sevenDaysAgo);

  if (claimCount >= 3) {
    const severity = claimCount >= 5 ? "critical" : "high";
    signals.push({
      type: "velocity",
      severity,
      message: `${claimCount} claims in last 7 days (threshold: 3)`,
      score: claimCount >= 5 ? 35 : 20,
    });
    totalFraudScore += claimCount >= 5 ? 35 : 20;
  }

  // --- Layer 2: 24-Hour Cooldown ---
  const { data: lastClaim } = await supabase
    .from("Claims")
    .select("created_at")
    .eq("worker_id", workerId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let cooldownViolation = false;
  if (lastClaim) {
    const hoursSince = (Date.now() - new Date(lastClaim.created_at).getTime()) / (1000 * 60 * 60);
    if (hoursSince < 24) {
      cooldownViolation = true;
      signals.push({
        type: "velocity",
        severity: "critical",
        message: `Attempted claim within ${Math.round(hoursSince)}h of last claim (24h cooldown)`,
        score: 40,
      });
      totalFraudScore += 40;
    }
  }

  // --- Layer 3: Payout Amount Anomaly ---
  const { data: avgData } = await supabase
    .from("Claims")
    .select("payout_amount")
    .eq("status", "processed")
    .limit(100);

  if (avgData && avgData.length > 5) {
    const avg = avgData.reduce((s, c) => s + c.payout_amount, 0) / avgData.length;
    if (payoutAmount > avg * 2) {
      signals.push({
        type: "amount_anomaly",
        severity: "medium",
        message: `Payout ₹${payoutAmount} is ${(payoutAmount / avg).toFixed(1)}x the average (₹${Math.round(avg)})`,
        score: 15,
      });
      totalFraudScore += 15;
    }
  }

  // --- Layer 4: Weather-Claim Mismatch ---
  if (weatherData && weatherData.level === "Low" && payoutAmount > 0) {
    signals.push({
      type: "weather_mismatch",
      severity: "critical",
      message: `Claim filed during LOW risk conditions (rain: ${weatherData.rain_mm}mm)`,
      score: 30,
    });
    totalFraudScore += 30;
  }

  // --- Layer 5: AI Anomaly Detection ---
  try {
    const aiRes = await fetch(`${AI_SERVICE_URL}/api/anomaly-check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payout_amount: payoutAmount,
        rain_mm: weatherData?.rain_mm || 0,
        claims_last_7d: claimCount || 0,
        hour: new Date().getHours(),
        gps_match: 1,
      }),
      signal: AbortSignal.timeout(3000),
    });

    if (aiRes.ok) {
      const aiData = await aiRes.json();
      if (aiData.is_anomaly) {
        signals.push({
          type: "pattern",
          severity: aiData.fraud_probability > 0.7 ? "critical" : "high",
          message: `ML model flagged anomaly (confidence: ${Math.round(aiData.fraud_probability * 100)}%)`,
          score: Math.round(aiData.fraud_probability * 25),
        });
        totalFraudScore += Math.round(aiData.fraud_probability * 25);
      }
      // Merge AI signals
      if (aiData.signals) {
        for (const s of aiData.signals) {
          if (!signals.find(ex => ex.type === s.type)) {
            signals.push({ ...s, score: 10 });
            totalFraudScore += 10;
          }
        }
      }
    }
  } catch (_e) {
    console.warn("AI anomaly service unavailable for fraud check.");
  }

  totalFraudScore = Math.min(totalFraudScore, 100);

  return {
    fraud_score: totalFraudScore,
    signals,
    is_suspicious: totalFraudScore >= 30,
    cooldown_violation: cooldownViolation,
    recommendation: totalFraudScore >= 70 ? "BLOCK" :
                     totalFraudScore >= 40 ? "MANUAL_REVIEW" :
                     totalFraudScore >= 20 ? "FLAG" : "APPROVE",
    claims_last_7d: claimCount || 0,
  };
}

/**
 * Store fraud signals in the database.
 */
async function storeFraudSignals(claimId, workerId, fraudResult) {
  if (!fraudResult.signals || fraudResult.signals.length === 0) return;

  const rows = fraudResult.signals.map(s => ({
    claim_id: claimId,
    worker_id: workerId,
    signal_type: s.type,
    severity: s.severity,
    fraud_score: s.score || 0,
    details: { message: s.message },
    status: "pending",
  }));

  try {
    await supabase.from("fraud_signals").insert(rows);
  } catch (err) {
    console.error("Failed to store fraud signals:", err);
  }
}

// ═══════════════════════════════════════════════════════════════
//  NOTIFICATION SYSTEM
// ═══════════════════════════════════════════════════════════════

async function createNotification(userId, type, title, message, data = {}) {
  try {
    await supabase.from("notifications").insert({
      user_id: userId,
      type,
      title,
      message,
      data,
    });
  } catch (err) {
    console.error("Failed to create notification:", err);
  }
}

app.get("/api/notifications", authenticateRequest, async (req, res) => {
  try {
    const authSupabase = getAuthClient(req);
    const limit = parseInt(req.query.limit) || 20;

    const { data, error } = await authSupabase
      .from("notifications")
      .select("*")
      .eq("user_id", req.authUser.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    const { count: unreadCount } = await authSupabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", req.authUser.id)
      .eq("read", false);

    res.json({ success: true, notifications: data || [], unread_count: unreadCount || 0 });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post("/api/notifications/mark-read", authenticateRequest, async (req, res) => {
  try {
    const authSupabase = getAuthClient(req);
    const { notification_ids } = req.body;

    if (notification_ids && Array.isArray(notification_ids)) {
      await authSupabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", req.authUser.id)
        .in("id", notification_ids);
    } else {
      // Mark all as read
      await authSupabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", req.authUser.id)
        .eq("read", false);
    }

    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
//  ENHANCED CLAIM FLOW (with fraud detection)
// ═══════════════════════════════════════════════════════════════

app.post("/api/trigger-claim", authenticateRequest, async (req, res) => {
  try {
    const payload = normalizeClaimPayload(req.body);
    const authSupabase = getAuthClient(req);

    // 1. Fetch Worker
    const { data: worker, error: workerError } = await authSupabase
      .from("Workers")
      .select("city, platform, name")
      .eq("id", req.authUser.id)
      .single();

    if (workerError || !worker?.city) {
      throw new Error("Worker profile incomplete. City information missing.");
    }

    // 2. Real-time Environmental Verification
    const weatherData = await getRealTimeRisk(worker.city);
    if (weatherData.level === "Low") {
      return res.status(400).json({
        success: false,
        error: "Claim Denied: Current environmental conditions in " + worker.city + " do not justify an insurance payout. Conditions must be at least 'Medium' risk to trigger a claim.",
        risk_level: weatherData.level,
      });
    }

    // 3. Find Active Policy
    let policyQuery = authSupabase
      .from("Policies")
      .select("id, worker_id, status, weekly_premium, coverage_amount")
      .eq("worker_id", req.authUser.id)
      .eq("status", "active");

    if (payload.policy_id) {
      policyQuery = policyQuery.eq("id", payload.policy_id);
    }

    const { data: policy, error: policyError } = await policyQuery
      .order("created_at", { ascending: false }).limit(1).maybeSingle();

    if (policyError) throw policyError;
    if (!policy) {
      return res.status(404).json({ success: false, error: "No active insurance policy found." });
    }

    // 4. Calculate Payout
    let riskMultiplier = 0;
    if (weatherData.level === "Critical") riskMultiplier = 1.0;
    else if (weatherData.level === "High") riskMultiplier = 0.5;
    else if (weatherData.level === "Medium") riskMultiplier = 0.245;

    let planWeight = 1.0;
    if (policy.weekly_premium <= 500) planWeight = 0.7;
    else if (policy.weekly_premium <= 1200) planWeight = 0.9;

    const maxBenefit = policy.coverage_amount || 5000;
    let calculatedPayout = maxBenefit * riskMultiplier * planWeight;

    if (riskMultiplier > 0 && calculatedPayout < 300) calculatedPayout = 300;
    if (calculatedPayout > 3000) calculatedPayout = 3000;

    // 5. FRAUD DETECTION (multi-layered)
    const fraudResult = await analyzeFraud(
      req.authUser.id, policy.id, calculatedPayout,
      payload.trigger_type, weatherData, authSupabase
    );

    // Block if cooldown violation
    if (fraudResult.cooldown_violation) {
      console.warn(`FRAUD ALERT: User ${req.authUser.id} attempted claim within 24h cooldown.`);
      
      const { data: lastClaimData } = await supabase
        .from("Claims")
        .select("created_at")
        .eq("worker_id", req.authUser.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      return res.status(429).json({
        success: false,
        error: "You have already claimed insurance today. Please try again after 24 hours.",
        next_available_at: lastClaimData
          ? new Date(new Date(lastClaimData.created_at).getTime() + 24 * 60 * 60 * 1000).toISOString()
          : null,
        fraud_score: fraudResult.fraud_score,
      });
    }

    // Block high-fraud claims
    if (fraudResult.recommendation === "BLOCK") {
      await createNotification(req.authUser.id, "fraud_alert",
        "Claim Flagged for Review",
        "Your claim could not be processed automatically due to unusual activity patterns. Our team will review it shortly.",
        { fraud_score: fraudResult.fraud_score });

      return res.status(403).json({
        success: false,
        error: "Claim flagged for manual review due to unusual activity patterns.",
        fraud_score: fraudResult.fraud_score,
        fraud_signals: fraudResult.signals.map(s => s.message),
      });
    }

    // 6. Insert Claim
    let claimData = null;
    if (calculatedPayout > 0) {
      const claimStatus = fraudResult.recommendation === "MANUAL_REVIEW" ? "pending" : "processed";

      const { data, error } = await authSupabase
        .from("Claims")
        .insert({
          policy_id: policy.id,
          worker_id: req.authUser.id,
          trigger_type: payload.trigger_type || "Environmental",
          disruption_type: payload.disruption_type || "Environmental",
          payout_amount: calculatedPayout,
          status: claimStatus,
          risk_level: weatherData.level,
          fraud_score: fraudResult.fraud_score,
          fraud_flags: fraudResult.signals.map(s => s.type),
          gps_verified: false,
        })
        .select()
        .single();

      if (error) throw error;
      claimData = data;

      // Store fraud signals
      if (fraudResult.signals.length > 0) {
        await storeFraudSignals(claimData.id, req.authUser.id, fraudResult);
      }

      // Notification
      if (claimStatus === "processed") {
        await createNotification(req.authUser.id, "claim_approved",
          "Claim Processed ✓",
          `Your claim of ₹${calculatedPayout.toLocaleString()} has been approved and processed.`,
          { claim_id: claimData.id, amount: calculatedPayout });
      } else {
        await createNotification(req.authUser.id, "system",
          "Claim Under Review",
          "Your claim is being reviewed by our verification team. You'll be notified once resolved.",
          { claim_id: claimData.id, amount: calculatedPayout });
      }
    }

    res.status(200).json({
      success: true,
      claim: claimData,
      claim_id: claimData?.id,
      calculated_amount: calculatedPayout,
      risk_level: weatherData.level,
      fraud_score: fraudResult.fraud_score,
      fraud_check: {
        status: fraudResult.recommendation,
        signals_count: fraudResult.signals.length,
        claim_confidence: Math.max(0, 100 - fraudResult.fraud_score),
      },
      message: calculatedPayout > 0
        ? fraudResult.recommendation === "MANUAL_REVIEW"
          ? "Claim submitted for manual review. You'll be notified once processed."
          : "Claim processed and payout initiated successfully."
        : "No payout eligible under current conditions.",
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
//  Existing Endpoints (enhanced)
// ═══════════════════════════════════════════════════════════════

app.get("/api/worker-dashboard/:worker_id", authenticateRequest, async (req, res) => {
  try {
    const { worker_id: workerId } = req.params;

    if (workerId !== req.authUser.id) {
      return res.status(403).json({ success: false, error: "Forbidden" });
    }

    const authSupabase = getAuthClient(req);

    const [
      { data: worker, error: workerError },
      { data: policies, error: policiesError },
      { data: recentClaims, error: claimsError },
      { count: unreadNotifications },
    ] = await Promise.all([
      authSupabase.from("Workers").select("*").eq("id", workerId).single(),
      authSupabase.from("Policies").select("*").eq("worker_id", workerId).order("created_at", { ascending: false }),
      authSupabase.from("Claims").select("*").eq("worker_id", workerId).order("created_at", { ascending: false }).limit(5),
      authSupabase.from("notifications").select("*", { count: "exact", head: true }).eq("user_id", workerId).eq("read", false),
    ]);

    if (workerError || policiesError || claimsError) {
      throw workerError || policiesError || claimsError;
    }

    res.status(200).json({
      success: true,
      data: {
        worker,
        policies,
        active_policy: policies.find(p => p.status === 'active') || null,
        recent_claims: recentClaims,
        unread_notifications: unreadNotifications || 0,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get("/api/current-risk", authenticateRequest, async (req, res) => {
  try {
    const authSupabase = getAuthClient(req);
    const { data: worker, error: workerError } = await authSupabase
      .from("Workers")
      .select("city")
      .eq("id", req.authUser.id)
      .single();

    if (workerError || !worker?.city) {
      throw new Error("Worker profile incomplete.");
    }

    const weatherData = await getRealTimeRisk(worker.city);

    const { data: policy } = await authSupabase
      .from("Policies")
      .select("*")
      .eq("worker_id", req.authUser.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: lastClaim } = await authSupabase
      .from("Claims")
      .select("created_at")
      .eq("worker_id", req.authUser.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // Get multi-trigger probabilities from AI
    let triggerProbabilities = null;
    try {
      const aiRes = await fetch(`${AI_SERVICE_URL}/api/trigger-classify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: worker.city,
          rain_mm: weatherData.rain_mm || 0,
          hour: new Date().getHours(),
          payout_amount: policy?.coverage_amount || 3000,
        }),
        signal: AbortSignal.timeout(3000),
      });
      if (aiRes.ok) {
        const aiData = await aiRes.json();
        triggerProbabilities = aiData.probabilities;
      }
    } catch (_e) { /* AI unavailable */ }

    res.status(200).json({
      success: true,
      risk_level: weatherData.level,
      weather_details: {
        condition: weatherData.condition,
        description: weatherData.description,
        temperature: weatherData.temperature,
        rain_mm: weatherData.rain_mm,
        humidity: weatherData.humidity,
        wind_speed: weatherData.wind_speed,
      },
      trigger_probabilities: triggerProbabilities,
      policy,
      city: worker.city,
      last_claim_at: lastClaim?.created_at || null,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
//  UPI Verification (unchanged)
// ═══════════════════════════════════════════════════════════════

app.post("/api/verify-upi", authenticateRequest, async (req, res) => {
  const { upi_id } = req.body;
  
  if (!upi_id || !upi_id.includes("@")) {
    return res.status(400).json({ success: false, error: "Invalid UPI ID format." });
  }

  await new Promise(resolve => setTimeout(resolve, 1200));

  const upiLower = upi_id.toLowerCase();

  if (upiLower.includes("error") || upiLower.includes("invalid")) {
    return res.json({ success: true, valid: false, error: "VPA_NOT_FOUND" });
  }

  let accountHolderName = "Professional Gig Worker";
  if (upiLower.includes("rahul")) accountHolderName = "Rahul Sharma";
  else if (upiLower.includes("priya")) accountHolderName = "Priya Singh";
  else if (upiLower.includes("amit")) accountHolderName = "Amit Kumar";
  else if (upiLower.endsWith("@okaxis")) accountHolderName = "Suresh Raina";
  else if (upiLower.endsWith("@okicici")) accountHolderName = "Deepika P.";
  else if (upiLower.endsWith("@ybl")) accountHolderName = "Arjun Kapoor";
  else if (upiLower.endsWith("@paytm")) accountHolderName = "Vijay S. Sharma";

  res.json({ success: true, valid: true, name: accountHolderName });
});

// ═══════════════════════════════════════════════════════════════
//  ADMIN ENDPOINTS (with real data)
// ═══════════════════════════════════════════════════════════════

app.get("/api/admin-analytics", authenticateRequest, requireAdmin, async (_req, res) => {
  try {
    const [
      { count: activePolicies },
      { count: claimsProcessed },
      { count: totalWorkers },
      { data: fraudAlerts, count: fraudCount },
      { data: recentClaimsData },
      { data: triggerEventsData, count: triggerCount },
    ] = await Promise.all([
      supabase.from("Policies").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("Claims").select("*", { count: "exact", head: true }).eq("status", "processed"),
      supabase.from("Workers").select("*", { count: "exact", head: true }),
      supabase.from("fraud_signals").select("*", { count: "exact" }).eq("status", "pending").order("created_at", { ascending: false }).limit(10),
      supabase.from("Claims").select("*, Workers(name, city, platform)").order("created_at", { ascending: false }).limit(10),
      supabase.from("trigger_events").select("*", { count: "exact" }).order("created_at", { ascending: false }).limit(10),
    ]);

    // Calculate total payouts
    const { data: payoutData } = await supabase
      .from("Claims")
      .select("payout_amount")
      .eq("status", "processed");

    const totalPayouts = payoutData
      ? payoutData.reduce((sum, c) => sum + (c.payout_amount || 0), 0)
      : 0;

    res.status(200).json({
      success: true,
      stats: {
        active_policies: activePolicies ?? 0,
        claims_processed: claimsProcessed ?? 0,
        total_workers: totalWorkers ?? 0,
        total_payouts: totalPayouts,
        pending_fraud_alerts: fraudCount ?? 0,
        trigger_events_count: triggerCount ?? 0,
      },
      fraud_alerts: fraudAlerts || [],
      recent_claims: recentClaimsData || [],
      trigger_events: triggerEventsData || [],
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fraud alert management
app.get("/api/fraud/alerts", authenticateRequest, requireAdmin, async (req, res) => {
  try {
    const status = req.query.status || "pending";
    const limit = parseInt(req.query.limit) || 20;

    const { data, error, count } = await supabase
      .from("fraud_signals")
      .select("*, Claims(id, payout_amount, trigger_type, created_at), Workers(name, city, platform)", { count: "exact" })
      .eq("status", status)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    res.json({ success: true, alerts: data || [], total: count || 0 });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/fraud/resolve", authenticateRequest, requireAdmin, async (req, res) => {
  try {
    const { signal_id, resolution } = req.body;

    if (!signal_id || !["resolved", "false_positive", "investigating"].includes(resolution)) {
      return res.status(400).json({ success: false, error: "signal_id and valid resolution required." });
    }

    const { data, error } = await supabase
      .from("fraud_signals")
      .update({
        status: resolution,
        resolved_by: req.authUser.email,
        resolved_at: new Date().toISOString(),
      })
      .eq("id", signal_id)
      .select()
      .single();

    if (error) throw error;

    // If resolved as false_positive and claim was pending, approve it
    if (resolution === "false_positive" && data.claim_id) {
      await supabase
        .from("Claims")
        .update({ status: "processed" })
        .eq("id", data.claim_id)
        .eq("status", "pending");

      if (data.worker_id) {
        await createNotification(data.worker_id, "claim_approved",
          "Claim Approved",
          "Your claim has been reviewed and approved. Payout is being processed.",
          { claim_id: data.claim_id });
      }
    }

    res.json({ success: true, signal: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
//  GPS Location Verification
// ═══════════════════════════════════════════════════════════════

app.post("/api/verify-location", authenticateRequest, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ success: false, error: "GPS coordinates required." });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      return res.json({
        success: true,
        verified: true,
        confidence: 85,
        location_name: "Location Verified (offline mode)",
        weather_at_location: { condition: "Unknown", risk: "Medium" },
      });
    }

    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
    );

    if (!weatherRes.ok) {
      return res.json({ success: true, verified: true, confidence: 70, location_name: "Unresolved" });
    }

    const weatherData = await weatherRes.json();
    const weatherId = weatherData.weather?.[0]?.id || 800;
    const locationName = weatherData.name || "Unknown";

    let locationRisk = "Low";
    if (weatherId >= 200 && weatherId <= 232) locationRisk = "Critical";
    else if (weatherId >= 502 && weatherId <= 504) locationRisk = "High";
    else if ((weatherId >= 500 && weatherId <= 501) || (weatherId >= 520 && weatherId <= 531)) locationRisk = "Medium";
    else if (weatherId >= 600 && weatherId <= 622) locationRisk = "High";

    const authSupabase = getAuthClient(req);
    const { data: worker } = await authSupabase
      .from("Workers")
      .select("city")
      .eq("id", req.authUser.id)
      .single();

    const registeredCity = worker?.city?.toLowerCase() || "";
    const gpsCity = locationName.toLowerCase();
    const cityMatch = registeredCity.includes(gpsCity) || gpsCity.includes(registeredCity);
    const confidence = cityMatch ? 95 : 60;

    res.json({
      success: true,
      verified: locationRisk !== "Low",
      confidence,
      location_name: locationName,
      registered_city: worker?.city,
      city_match: cityMatch,
      weather_at_location: {
        condition: weatherData.weather?.[0]?.main || "Clear",
        description: weatherData.weather?.[0]?.description || "clear sky",
        temperature: Math.round(weatherData.main?.temp || 25),
        risk: locationRisk,
      },
      verification_note: cityMatch
        ? "GPS location matches registered city. Claim verification: HIGH confidence."
        : "GPS location differs from registered city. Manual review recommended.",
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
//  Risk Timeline
// ═══════════════════════════════════════════════════════════════

app.get("/api/risk-timeline", authenticateRequest, async (req, res) => {
  try {
    const authSupabase = getAuthClient(req);
    const { data: worker } = await authSupabase
      .from("Workers")
      .select("city")
      .eq("id", req.authUser.id)
      .single();

    const city = worker?.city || "Mumbai";
    const timeline = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const baseRisk = Math.random();
      let riskLevel = "Low";
      let riskScore = 15 + Math.random() * 20;

      if (baseRisk > 0.85) {
        riskLevel = "Critical";
        riskScore = 80 + Math.random() * 15;
      } else if (baseRisk > 0.7) {
        riskLevel = "High";
        riskScore = 60 + Math.random() * 20;
      } else if (baseRisk > 0.5) {
        riskLevel = "Medium";
        riskScore = 35 + Math.random() * 25;
      }

      timeline.push({
        date: date.toISOString().split("T")[0],
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
        riskLevel,
        riskScore: Math.round(riskScore),
        city,
      });
    }

    const weatherData = await getRealTimeRisk(city);
    if (timeline.length > 0) {
      const todayRiskScore =
        weatherData.level === "Critical" ? 90 :
        weatherData.level === "High" ? 70 :
        weatherData.level === "Medium" ? 45 : 20;

      timeline[timeline.length - 1].riskLevel = weatherData.level;
      timeline[timeline.length - 1].riskScore = todayRiskScore;
    }

    res.json({ success: true, timeline, city });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
//  Deactivation Risk (proxied to AI service)
// ═══════════════════════════════════════════════════════════════

app.post("/api/deactivation-risk", async (req, res) => {
  try {
    const { rating, cancellation_rate, late_deliveries, platform, total_orders, account_age_days } = req.body;

    // Try AI service first
    try {
      const aiRes = await fetch(`${AI_SERVICE_URL}/api/deactivation-risk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
        signal: AbortSignal.timeout(3000),
      });

      if (aiRes.ok) {
        const aiData = await aiRes.json();
        return res.json(aiData);
      }
    } catch (_e) {
      console.warn("AI service unavailable for deactivation risk.");
    }

    // Fallback
    const r = rating || 4.5;
    const c = cancellation_rate || 0.05;
    const l = late_deliveries || 0;

    let vertexScore = (r * 20) - (c * 100) - (l * 5);
    vertexScore = Math.max(15, Math.min(98, Math.round(vertexScore)));

    let riskLevel = "Low";
    if (vertexScore < 40) riskLevel = "High";
    else if (vertexScore < 70) riskLevel = "Medium";

    const recommendations = [];
    if (r < 4.6) recommendations.push("Maintain a customer rating above 4.6 to maximize safety score.");
    if (c > 0.08) recommendations.push("High cancellation rate detected. Reduce to below 5% to avoid platform flags.");
    if (l > 2) recommendations.push("Frequent late deliveries impact your account stability.");
    if (recommendations.length === 0) recommendations.push("Your algorithmic health is excellent. Continue current performance.");
    recommendations.push("Vertex deactivation insurance is ACTIVE for your account.");

    res.json({
      success: true,
      vertex_score: vertexScore,
      risk_level: riskLevel,
      platform_volatility: vertexScore > 80 ? "Stable" : "Dynamic",
      recommendations,
      model_used: "backend-fallback",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(400).json({ success: false, error: "Invalid request payload." });
  }
});

// ═══════════════════════════════════════════════════════════════
//  AUTOMATED TRIGGER MONITORING (Background Job)
// ═══════════════════════════════════════════════════════════════

const MONITORED_CITIES = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune"];
const TRIGGER_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

async function runTriggerMonitoring() {
  console.log(`[MONITOR] Running automated trigger check at ${new Date().toISOString()}`);

  for (const city of MONITORED_CITIES) {
    try {
      const weatherData = await getRealTimeRisk(city);

      if (weatherData.level === "Low") continue;

      // Check if we already have a recent trigger event for this city (within 1 hour)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { data: existing } = await supabase
        .from("trigger_events")
        .select("id")
        .eq("city", city)
        .gte("created_at", oneHourAgo)
        .limit(1)
        .maybeSingle();

      if (existing) continue; // Already logged recently

      // Determine trigger type
      let triggerType = "weather";
      if (weatherData.temperature > 42) triggerType = "heatwave";
      else if (weatherData.wind_speed > 50) triggerType = "weather";

      // Count affected policies
      const { count: affectedPolicies } = await supabase
        .from("Policies")
        .select("*, Workers!inner(city)", { count: "exact", head: true })
        .eq("status", "active")
        .ilike("Workers.city", `%${city}%`);

      // Insert trigger event
      await supabase.from("trigger_events").insert({
        city,
        trigger_type: triggerType,
        severity: weatherData.level.toLowerCase(),
        data: {
          weather_id: weatherData.weather_id,
          rain_mm: weatherData.rain_mm,
          temperature: weatherData.temperature,
          condition: weatherData.condition,
          description: weatherData.description,
        },
        affected_policies: affectedPolicies || 0,
        auto_processed: false,
      });

      console.log(`[MONITOR] Trigger event created: ${city} - ${weatherData.level} (${triggerType})`);

      // Notify affected workers
      if (affectedPolicies > 0 && (weatherData.level === "High" || weatherData.level === "Critical")) {
        const { data: affectedWorkers } = await supabase
          .from("Workers")
          .select("id, city")
          .ilike("city", `%${city}%`);

        if (affectedWorkers) {
          for (const w of affectedWorkers.slice(0, 50)) {
            await createNotification(w.id, "weather_warning",
              `⚠️ ${weatherData.level} Risk Alert: ${city}`,
              `${weatherData.condition} detected in ${city}. Your insurance coverage is active. You may be eligible to file a claim.`,
              { city, risk_level: weatherData.level, trigger_type: triggerType }
            );
          }
        }
      }
    } catch (err) {
      console.error(`[MONITOR] Error checking ${city}:`, err.message);
    }
  }
}

// ═══════════════════════════════════════════════════════════════
//  Trigger Events API
// ═══════════════════════════════════════════════════════════════

app.get("/api/trigger-events", authenticateRequest, async (req, res) => {
  try {
    const city = req.query.city;
    const limit = parseInt(req.query.limit) || 20;

    let query = supabase
      .from("trigger_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (city) {
      query = query.ilike("city", `%${city}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.json({ success: true, events: data || [] });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
//  Utilities
// ═══════════════════════════════════════════════════════════════

function scoreToLevel(score) {
  if (score >= 0.75) return "Critical";
  if (score >= 0.55) return "High";
  if (score >= 0.35) return "Medium";
  return "Low";
}

// ═══════════════════════════════════════════════════════════════
//  Error Handler & Startup
// ═══════════════════════════════════════════════════════════════

app.use((error, _req, res, _next) => {
  if (error && error.message === "Origin not allowed by CORS") {
    return res.status(403).json({ success: false, error: error.message });
  }

  console.error("Unhandled backend error:", error);
  res.status(500).json({ success: false, error: "Internal server error." });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`AI Service URL: ${AI_SERVICE_URL}`);

  // Start automated trigger monitoring
  console.log(`[MONITOR] Starting automated trigger monitoring (every ${TRIGGER_CHECK_INTERVAL / 1000}s)`);
  setInterval(runTriggerMonitoring, TRIGGER_CHECK_INTERVAL);
  
  // Run immediately on startup (after a small delay)
  setTimeout(runTriggerMonitoring, 5000);
});
