const fs = require('fs');
const file = 'C:/Users/kshah/Desktop/insurance app/frontend/src/app/risk-analysis/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `    // Fallback data for showcase
    const city = searchParams.get("city") || "Mumbai";
    const platform = searchParams.get("platform") || "Swiggy";`,
  `    // Fallback data for showcase
    const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "Mumbai");
    const platform = searchParams.get("platform") || "Swiggy";
    
    // Weather State
    const [weatherData, setWeatherData] = useState<any>(null);
    const [weatherLoading, setWeatherLoading] = useState(true);`
);

content = content.replace(
  `    useEffect(() => {
        async function fetchPremium() {`,
  `    useEffect(() => {
        async function fetchWeather() {
            setWeatherLoading(true);
            try {
                const res = await fetch(\`/api/weather?city=\${encodeURIComponent(selectedCity)}\`);
                if (res.ok) {
                    const json = await res.json();
                    setWeatherData(json);
                } else {
                    setWeatherData(null);
                }
            } catch (err) {
                console.error(err);
                setWeatherData(null);
            } finally {
                setWeatherLoading(false);
            }
        }
        fetchWeather();
    }, [selectedCity]);

    useEffect(() => {
        async function fetchPremium() {`
);

content = content.replace(
  `const res = await apiFetch(\`/api/calculate-premium?city=\${encodeURIComponent(city)}&platform=\${encodeURIComponent(platform)}\`);`,
  `const res = await apiFetch(\`/api/calculate-premium?city=\${encodeURIComponent(selectedCity)}&platform=\${encodeURIComponent(platform)}\`);`
);

content = content.replace(
  `}, [city, platform]);`,
  `}, [selectedCity, platform]);`
);

content = content.replace(
  `<p className="text-slate-500">Real-time environmental data & premium modeling for {city}</p>`,
  `<div className="mt-2 flex items-center gap-2">
                                    <p className="text-slate-500">Real-time environmental data & premium modeling for</p>
                                    <select 
                                        value={selectedCity} 
                                        onChange={(e) => setSelectedCity(e.target.value)}
                                        className="bg-white border border-primary/10 rounded-lg px-2 py-1 text-sm font-bold text-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                                    >
                                        <option value="Mumbai">Mumbai</option>
                                        <option value="Delhi">Delhi</option>
                                        <option value="San Francisco">San Francisco</option>
                                        <option value="New York">New York</option>
                                        <option value="Austin">Austin</option>
                                        <option value="London">London</option>
                                        <option value="Tokyo">Tokyo</option>
                                    </select>
                                </div>`
);

content = content.replace(
  `Weather parameters in <span className="font-bold">{city}</span>`,
  `Weather parameters in <span className="font-bold">{selectedCity}</span>`
);

content = content.replace(
  `<span className="text-xs font-bold text-slate-500 uppercase">Rainfall</span>
                                        </div>
                                        <div className="text-2xl font-bold text-primary">42mm</div>
                                        <div className="text-xs font-medium text-red-500 mt-1 flex items-center">
                                            <TrendingUp className="w-3 h-3 mr-1" /> +14%
                                        </div>`,
  `<span className="text-xs font-bold text-slate-500 uppercase">Weather</span>
                                        </div>
                                        <div className="text-xl font-bold text-primary capitalize">{weatherLoading ? "..." : (weatherData?.description || "Clear")}</div>
                                        <div className="text-xs font-medium text-slate-500 mt-1 flex items-center">
                                            {weatherLoading ? "..." : \`\${weatherData?.temperature || 25}°C\`}
                                        </div>`
);

content = content.replace(
  `<span className="text-xs font-bold text-slate-500 uppercase">Pollution</span>
                                        </div>
                                        <div className="text-2xl font-bold text-primary">AQI 48</div>
                                        <div className="text-xs font-medium text-green-500 mt-1 flex items-center">
                                            <TrendingDown className="w-3 h-3 mr-1" /> Good
                                        </div>`,
  `<span className="text-xs font-bold text-slate-500 uppercase">Rain Volume</span>
                                        </div>
                                        <div className="text-2xl font-bold text-primary">{weatherLoading ? "..." : \`\${weatherData?.rainVolume || 0}mm\`}</div>
                                        <div className="text-xs font-medium text-blue-500 mt-1 flex items-center">
                                            <Droplets className="w-3 h-3 mr-1" /> Last hour
                                        </div>`
);

content = content.replace(
  `<span className="text-xs font-bold text-slate-500 uppercase">Flood Risk</span>
                                        </div>
                                        <div className="text-2xl font-bold text-primary">High</div>
                                        <div className="text-xs font-medium text-red-500 mt-1 flex items-center">
                                            <span className="relative flex h-2 w-2 mr-2">
                                                <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                            </span>
                                            Alert Level 2
                                        </div>`,
  `<span className="text-xs font-bold text-slate-500 uppercase">Flood Risk</span>
                                        </div>
                                        <div className="text-2xl font-bold text-primary">{weatherLoading ? "..." : (weatherData?.riskLevel || "Low")}</div>
                                        <div className={\`text-xs font-medium mt-1 flex items-center \${weatherData?.riskLevel === 'Low' ? 'text-green-500' : weatherData?.riskLevel === 'Medium' ? 'text-yellow-500' : 'text-red-500'}\`}>
                                            <span className="relative flex h-2 w-2 mr-2">
                                                <span className={\`absolute inline-flex h-full w-full rounded-full opacity-75 \${weatherData?.riskLevel === 'Low' ? 'bg-green-400' : weatherData?.riskLevel === 'Medium' ? 'bg-yellow-400' : 'bg-red-400'}\`}></span>
                                                <span className={\`relative inline-flex rounded-full h-2 w-2 \${weatherData?.riskLevel === 'Low' ? 'bg-green-500' : weatherData?.riskLevel === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'}\`}></span>
                                            </span>
                                            Alert Level
                                        </div>`
);

content = content.replace(/Live Monitoring Area: \{city\}/, "Live Monitoring Area: {selectedCity}");
content = content.replace(/risk analysis in \{city\}/, "risk analysis in {selectedCity}");

fs.writeFileSync(file, content);
