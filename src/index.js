// Module System
import promptSync from "prompt-sync";
const prompt = promptSync({ sigint: true });

// Konfigurasi dotenv
import dotenv from "dotenv";
dotenv.config();

const UNITS = "metric";
const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.API_KEY;

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