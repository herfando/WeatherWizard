// module system
import PromptSync from "prompt-sync";
const Prompt = PromptSync({ sigint: true});

//konfigurasi dotenv
import dotenv from "dotenv";
dotenv.config();

const UNITS = "metric";

async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
}

async function getWeather(city) {
    const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${UNITS}`;
    return fetchData(url);
}

