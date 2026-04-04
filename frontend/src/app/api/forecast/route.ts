import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") || "Mumbai";

  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey || apiKey === "your_openweather_key_here") {
    return NextResponse.json(generateFallbackForecast(city), { status: 200 });
  }

  try {
    // Use OpenWeather 5-day/3-hour forecast API
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&cnt=40`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return NextResponse.json(generateFallbackForecast(city), { status: 200 });
    }

    const data = await res.json();
    const dailyForecasts = aggregateDailyForecasts(data.list || []);

    // Calculate earnings impact for each day
    const forecastDays = dailyForecasts.map((day: any) => {
      const riskLevel = getRiskFromWeatherId(day.weatherId, day.rainVolume);
      const earningsImpact = calculateEarningsImpact(riskLevel);
      
      return {
        date: day.date,
        dayName: day.dayName,
        weatherCondition: day.condition,
        description: day.description,
        temperature: day.temp,
        humidity: day.humidity,
        rainVolume: day.rainVolume,
        riskLevel,
        earningsImpact,
        estimatedLoss: earningsImpact.estimatedLossPercent,
        recommendation: getRecommendation(riskLevel, earningsImpact),
      };
    });

    return NextResponse.json({
      city: data.city?.name || city,
      forecast: forecastDays.slice(0, 5), // 5 days
      generatedAt: new Date().toISOString(),
    }, { status: 200 });

  } catch (error) {
    console.error("Forecast API Error:", error);
    return NextResponse.json(generateFallbackForecast(city), { status: 200 });
  }
}

function aggregateDailyForecasts(list: any[]) {
  const dayMap: Record<string, any> = {};

  for (const entry of list) {
    const date = entry.dt_txt.split(" ")[0];
    if (!dayMap[date]) {
      const d = new Date(entry.dt * 1000);
      dayMap[date] = {
        date,
        dayName: d.toLocaleDateString("en-US", { weekday: "long" }),
        temp: entry.main.temp,
        humidity: entry.main.humidity,
        rainVolume: 0,
        weatherId: entry.weather[0]?.id || 800,
        condition: entry.weather[0]?.main || "Clear",
        description: entry.weather[0]?.description || "clear sky",
        count: 1,
      };
    } else {
      dayMap[date].temp = (dayMap[date].temp + entry.main.temp) / 2;
      dayMap[date].humidity = Math.max(dayMap[date].humidity, entry.main.humidity);
      dayMap[date].count++;
      // Track worst weather of the day
      const entryId = entry.weather[0]?.id || 800;
      if (entryId < dayMap[date].weatherId) {
        dayMap[date].weatherId = entryId;
        dayMap[date].condition = entry.weather[0]?.main;
        dayMap[date].description = entry.weather[0]?.description;
      }
      if (entry.rain?.["3h"]) dayMap[date].rainVolume += entry.rain["3h"];
    }
  }

  return Object.values(dayMap);
}

function getRiskFromWeatherId(weatherId: number, rainVolume: number): string {
  if (weatherId >= 200 && weatherId <= 232) return "Critical";
  if (weatherId >= 502 && weatherId <= 504) return "High";
  if ((weatherId >= 500 && weatherId <= 501) || (weatherId >= 520 && weatherId <= 531)) return "Medium";
  if (weatherId >= 600 && weatherId <= 622) return "High";
  if (weatherId === 781 || weatherId === 771) return "Critical";
  if (rainVolume > 10) return "High";
  return "Low";
}

function calculateEarningsImpact(riskLevel: string) {
  const avgDailyEarning = 1200; // ₹1200 avg for gig workers

  switch (riskLevel) {
    case "Critical":
      return { estimatedLossPercent: 85, estimatedLoss: Math.round(avgDailyEarning * 0.85), severity: "Severe" };
    case "High":
      return { estimatedLossPercent: 60, estimatedLoss: Math.round(avgDailyEarning * 0.60), severity: "Significant" };
    case "Medium":
      return { estimatedLossPercent: 30, estimatedLoss: Math.round(avgDailyEarning * 0.30), severity: "Moderate" };
    default:
      return { estimatedLossPercent: 0, estimatedLoss: 0, severity: "None" };
  }
}

function getRecommendation(riskLevel: string, impact: any): string {
  switch (riskLevel) {
    case "Critical":
      return `Expected earning loss: ₹${impact.estimatedLoss}. Strongly recommend Elite coverage.`;
    case "High":
      return `Potential loss: ₹${impact.estimatedLoss}. Pro Plan or higher recommended.`;
    case "Medium":
      return `Minor disruption expected (₹${impact.estimatedLoss} loss). Starter Plan covers this.`;
    default:
      return "Clear conditions. Good earning day ahead.";
  }
}

function generateFallbackForecast(city: string) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const today = new Date();
  
  return {
    city,
    forecast: days.map((_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const riskLevel = i === 2 ? "Medium" : "Low";
      const earningsImpact = calculateEarningsImpact(riskLevel);
      
      return {
        date: date.toISOString().split("T")[0],
        dayName: date.toLocaleDateString("en-US", { weekday: "long" }),
        weatherCondition: i === 2 ? "Rain" : "Clear",
        description: i === 2 ? "light rain" : "clear sky",
        temperature: 28 + Math.round(Math.random() * 4),
        humidity: 50 + Math.round(Math.random() * 20),
        rainVolume: i === 2 ? 5.2 : 0,
        riskLevel,
        earningsImpact,
        estimatedLoss: earningsImpact.estimatedLossPercent,
        recommendation: getRecommendation(riskLevel, earningsImpact),
      };
    }),
    generatedAt: new Date().toISOString(),
    isFallback: true,
  };
}
