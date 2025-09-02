// module system
import PromptSync from "prompt-sync";
const Prompt = PromptSync({ sigint: true});

//konfigurasi dotenv
import dotenv from "dotenv";
dotenv.config();

const UNITS = "metric";
const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.API_KEY

async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
}

async function getWeather(city) {
    const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${UNITS}`;
    return fetchData(url);
}

//fungsi utama
(async function main() {
    console.log("===Weather APP");
    console.log(
        "Ketik nama kota untuk melihat cuaca atau exit untuk keluar dari progaram"
    );

    while (true) {
        const city = prompt("Kota :").trim();
        if (!city || city.toLowerCase() === "exit") break;

        try{
            const data = await getWeather(city)
            console.log(`Cuaca di ${data.name}, `);
            console.log(`Suhu : ${data.main.temp}C`)
        }   catch (err) {
            console.log('Cuaca di ${data.name}');
        }
    }
    
})