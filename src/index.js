const API_KEY = document.querySelector('meta[name="API_KEY"]').content;
const BASE_URL = document.querySelector('meta[name="BASE_URL"]').content;
let UNITS = "metric";
const LANG = "id";

// Konfigurasi Util DOM
const $ = (s) => document.querySelector(s);
const statusEl = $("#status");
const errorEl = $("#error");
const resultEl = $("#result");
const form = $("#search-form");
const inputCity = $("#city-input");
const unitSel = $("#unit-select");
const btn = $("#btn-submit");

const show = (elemen) => (elemen.hidden = false);
const hide = (elemen) => (elemen.hidden = true);
const setText = (id, text) => (document.getElementById(id).textContent = text);

const degToCompass = (deg = 0) => {
  const dir = [
    "U",
    "U-Timur",
    "Timur",
    "S-Timur",
    "Selatan",
    "S-Barat",
    "Barat",
    "U-Barat",
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
  )}&appid=${API_KEY}&units=${UNITS}`;
  return fetchData(url);
}

// Fungsi Utama
(async function main() {
  console.log("==== Weather App ====");
  console.log(
    "Ketik nama Kota untuk melihat cuaca atau exit untuk keluar dari program."
  );
  while (true) {
    const city = prompt("Kota : ").trim();
    if (!city || city.toLowerCase() === "exit") break;

    try {
      const data = await getWeather(city);
      console.log(
        `Cuaca di ${data.name}, ${
          data.sys.country === "ID" ? "Indonesia" : "Etc."
        }`
      );
      console.log(
        `Suhu : ${data.main.temp}°C (Min : ${data.main.temp_min}°C / Max : ${data.main.temp_max}°C)`
      );
      console.log(`Kondisi : ${data.weather[0].description}`);
      console.log(`Angin : ${data.wind.speed} m/s`);
      console.log(`Kelembapan : ${data.main.humidity}%`);
    } catch (err) {
      console.error("Error : " + err.message);
    }
  }

  console.log("Terimakasih sudah menggunakan Apps nyaa....");
})();