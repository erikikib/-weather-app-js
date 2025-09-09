const form = document.getElementById('form');
const cityInput = document.getElementById('city');
const out = document.getElementById('out');

// Free endpoint: open-meteo (no key needed)
async function getWeather(city) {
  // 1) geocode city name to lat/lon via open-meteo geocoding
  const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`).then(r=>r.json());
  if (!geo.results || !geo.results.length) throw new Error('City not found');
  const { latitude, longitude, name, country } = geo.results[0];

  // 2) current weather
  const wx = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`).then(r=>r.json());
  const cw = wx.current_weather;
  return { city: `${name}, ${country}`, temp: cw.temperature, wind: cw.windspeed, code: cw.weathercode, time: cw.time };
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  out.textContent = 'Loading…';
  try {
    const w = await getWeather(cityInput.value.trim());
    out.textContent = `${w.city}\nTemperature: ${w.temp} °C\nWind: ${w.wind} km/h\nTime: ${w.time}`;
  } catch (err) {
    out.textContent = 'Error: ' + err.message;
  }
});
