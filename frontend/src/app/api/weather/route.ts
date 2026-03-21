import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") || "Mumbai";
  const simulate = searchParams.get("simulate");

  const apiKey = process.env.OPENWEATHER_API_KEY;

  // Simulation Mode for testing UI and Premium hikes
  if (simulate) {
    return NextResponse.json({
      city: `${city} (Simulated)`,
      weatherCondition: simulate === "heavy_rain" ? "Rain" : "Clear",
      description: simulate === "heavy_rain" ? "heavy intensity rain" : "clear sky",
      temperature: simulate === "heavy_rain" ? 18 : 32,
      humidity: simulate === "heavy_rain" ? 85 : 40,
      rainVolume: simulate === "heavy_rain" ? 15.5 : 0,
      riskLevel: simulate === "heavy_rain" ? "High" : "Low",
      isSimulated: true
    }, { status: 200 });
  }

  if (!apiKey || apiKey === "your_openweather_key_here") {
    console.log("Weather API: Falling back because API key is:", apiKey);
    return NextResponse.json(
      { error: "OpenWeather API Key not configured. Using fallback data.",
        weatherCondition: "Clear",
        temperature: 28,
        riskLevel: "Low",
        description: "clear sky",
        rainVolume: 0,
        isFallback: true,
        debugKey: apiKey ? apiKey.substring(0, 4) + "..." : "missing"
      },
      { status: 200 }
    );
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { error: errorData.message || "Failed to fetch weather data" },
        { status: res.status }
      );
    }

    const data = await res.json();
    
    // Extract weather info
    const weatherArray = data.weather || [];
    const mainWeather = weatherArray.length > 0 ? weatherArray[0] : null;
    const condition = mainWeather?.main || "Clear";
    const description = mainWeather?.description || "clear sky";
    const weatherId = mainWeather?.id || 800;
    const temp = data.main?.temp || 25;
    const rain1h = data.rain ? data.rain["1h"] || 0 : 0;
    const rain3h = data.rain ? data.rain["3h"] || 0 : 0;
    const rainVolume = rain1h || rain3h || 0;

    // Determine Risk Level Based on Condition Codes
    // 2xx: Thunderstorm, 3xx: Drizzle, 5xx: Rain, 6xx: Snow, 7xx: Atmosphere, 800: Clear, 80x: Clouds
    let riskLevel = "Low";
    
    if (weatherId >= 200 && weatherId <= 232) {
      riskLevel = "Critical"; // Thunderstorm
    } else if (weatherId >= 502 && weatherId <= 504) {
      riskLevel = "High"; // Heavy / Extreme Rain
    } else if ((weatherId >= 500 && weatherId <= 501) || (weatherId >= 520 && weatherId <= 531)) {
      riskLevel = "Medium"; // Moderate Rain / Showers
    } else if (weatherId >= 600 && weatherId <= 622) {
      riskLevel = "High"; // Snow
    } else if (weatherId === 781 || weatherId === 771) {
      riskLevel = "Critical"; // Tornado or Squalls
    } else if (rainVolume > 10) { // More than 10mm rain
      riskLevel = "High";
    }

    return NextResponse.json(
      {
        city: data.name,
        weatherCondition: condition,
        description: description,
        temperature: Math.round(temp),
        humidity: data.main?.humidity || 0,
        rainVolume: rainVolume,
        riskLevel: riskLevel,
        rawCode: weatherId
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("OpenWeather API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error fetching weather" },
      { status: 500 }
    );
  }
}
