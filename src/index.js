// common js system
// const = require('prompt-sync'){{ sigint: true}};

// module system
import PromptSync from "prompt-sync";
const Prompt = PromptSync({ sigint: true});

const API_KEY = "dcc3604a4b0796b62d62524af136c6d3"
const GEOCODE = "https://api.openweathermap.org/geo/1.0/direct"
const CURRENT = "https://api.openweathermap.org/data/2.5/weather"
