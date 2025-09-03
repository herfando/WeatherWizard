// index.js

// Konfigurasi API dari meta
const API_KEY = document.querySelector('meta[name="API_KEY"]').content;
const BASE_URL = document.querySelector('meta[name="BASE_URL"]').content;
let UNITS = "metric";
const LANG = "id";

// Util DOM
const $ = (s) => document.querySelector(s);
const statusEl = $("#status");
const errorEl = $("#error");
const resultEl = $("#result");
const form = $("#search-form");
const inputCity = $("#city-input");
const unitSel = $("#unit-select");

// Elemen hasil
const setText = (id, text) => (document.getElementById(id).textContent = text);
const wxIcon = $("#wx-icon");

const degToCompass = (deg = 0) => {
  const dir = [
    "U", "U-Timur", "Timur", "S-Timur",
    "Selatan", "S-Barat", "Barat", "U-Barat",
  ];
  return dir[Math.round((deg % 360) / 45) % 8];
};

const fmtUnit = (units, t) =>
  t == null ? "-" : units === "imperial" ? `${t}°F` : `${t}°C`;

const toLocalTime = (unix, tz) => {
  try {
    return new Date((unix + (tz ?? 0)) * 1000).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return "-";
  }
};

async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function getWeather(city) {
  const url = `${BASE_URL}?q=${encodeURIComponent(
    city
  )}&appid=${API_KEY}&units=${UNITS}&lang=${LANG}`;
  return fetchData(url);
}

// Event submit form
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const city = inputCity.value.trim();
  UNITS = unitSel.value;

  if (!city) return;

  // tampilkan loading
  statusEl.hidden = false;
  errorEl.hidden = true;
  resultEl.hidden = true;

  try {
    const data = await getWeather(city);

    setText("city-name", data.name);
    setText("country-line", data.sys.country);
    setText("temp-now", fmtUnit(UNITS, Math.round(data.main.temp)));
    setText("desc-line", data.weather[0].description);

    setText("feels", fmtUnit(UNITS, Math.round(data.main.feels_like)));
    setText(
      "range",
      `${fmtUnit(UNITS, Math.round(data.main.temp_min))} - ${fmtUnit(
        UNITS,
        Math.round(data.main.temp_max)
      )}`
    );
    setText("wind", `${data.wind.speed} ${UNITS === "metric" ? "m/s" : "mph"} ${degToCompass(data.wind.deg)}`);
    setText("humid", `${data.main.humidity}%`);
    setText("press", `${data.main.pressure} hPa`);
    setText(
      "sun",
      `↑ ${toLocalTime(data.sys.sunrise, data.timezone)} / ↓ ${toLocalTime(
        data.sys.sunset,
        data.timezone
      )}`
    );

    wxIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    wxIcon.alt = data.weather[0].description;

    resultEl.hidden = false;
  } catch (err) {
    console.error(err);
    errorEl.hidden = false;
  } finally {
    statusEl.hidden = true;
  }
});
