const fs = require('fs');
const file = 'C:/Users/kshah/Desktop/insurance app/frontend/src/app/analytics/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add imports
content = content.replace(
  `import { useRouter } from 'next/navigation';`,
  `import { useRouter } from 'next/navigation';\nimport { useState, useEffect } from 'react';\nimport { CloudRain, Droplets, Wind } from 'lucide-react';`
);

// Add states and fetch logic
content = content.replace(
  `export default function AnalyticsPage() {
  const router = useRouter();`,
  `export default function AnalyticsPage() {
  const router = useRouter();
  
  const [selectedCity, setSelectedCity] = useState("Mumbai");
  const [weatherData, setWeatherData] = useState<any>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
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
  }, [selectedCity]);`
);

// Add City Selector to header
content = content.replace(
  `<h1 className="text-4xl font-black tracking-tight mb-2">Risk Analytics</h1>
            <p className="text-primary/60 font-medium">Real-time localized risk insights and protection metrics.</p>`,
  `<h1 className="text-4xl font-black tracking-tight mb-2">Risk Analytics</h1>
            <div className="flex items-center gap-3 mt-2">
                <p className="text-primary/60 font-medium">Real-time localized risk insights for</p>
                <select 
                    value={selectedCity} 
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="bg-background-light dark:bg-slate-900 border border-primary/10 rounded-xl px-4 py-2 text-sm font-black text-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer hover:bg-slate-50 transition-colors"
                >
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="San Francisco">San Francisco</option>
                    <option value="New York">New York</option>
                    <option value="Austin">Austin</option>
                    <option value="London">London</option>
                    <option value="Tokyo">Tokyo</option>
                    <option value="Dubai">Dubai</option>
                </select>
            </div>`
);

// Build new dynamic weather stats
content = content.replace(
  `const stats = [
    { label: 'Risk Score', value: 'Low', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Active Coverage', value: '₹10,00,000', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Protected Days', value: '156', icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Safety Index', value: '98%', icon: Activity, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];`,
  `const dynamicRiskScore = weatherData?.riskLevel === 'Critical' ? 'Critical' : weatherData?.riskLevel === 'High' ? 'High' : weatherData?.riskLevel === 'Medium' ? 'Medium' : 'Low';
  const riskColor = dynamicRiskScore === 'Critical' ? 'text-red-500' : dynamicRiskScore === 'High' ? 'text-orange-500' : dynamicRiskScore === 'Medium' ? 'text-yellow-500' : 'text-emerald-500';
  const riskBg = dynamicRiskScore === 'Critical' ? 'bg-red-500/10' : dynamicRiskScore === 'High' ? 'bg-orange-500/10' : dynamicRiskScore === 'Medium' ? 'bg-yellow-500/10' : 'bg-emerald-500/10';

  const stats = [
    { label: 'Weather Risk', value: weatherLoading ? '...' : dynamicRiskScore, icon: ShieldCheck, color: riskColor, bg: riskBg },
    { label: 'Weather Condition', value: weatherLoading ? '...' : (weatherData?.weatherCondition || 'Clear'), icon: CloudRain, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Precipitation', value: weatherLoading ? '...' : \`\${weatherData?.rainVolume || 0}mm\`, icon: Droplets, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Temperature', value: weatherLoading ? '...' : \`\${weatherData?.temperature || 25}°C\`, icon: Activity, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];`
);

// Update Radar Map to show real-time selected city
content = content.replace(
  `<p className="text-xs max-w-[200px] text-center">Refining grid data for Bandra, Mumbai based on active alerts.</p>`,
  `<p className="text-xs max-w-[200px] text-center">Refining grid data for {selectedCity} based on active weather alerts. Condition: {weatherData?.description || 'normal'}.</p>`
);

fs.writeFileSync(file, content);
