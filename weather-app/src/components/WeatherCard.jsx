import { useState } from "react";

function WeatherCard() {
    const [city, setCity] = useState("");
    const [temp, setTemp] = useState("");
    const [desc, setDesc] = useState("");

    const getWeather = async () => {
        const apiKey = "YOUR_API_KEY";

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        const data = await response.json();

        if (data.cod === 200) {
            setTemp(data.main.temp);
            setDesc(data.weather[0].description);
        } else {
            alert("City not found or API key not active yet");
        }
    };


    return (
        <div className="card">
            <input
                type="text"
                placeholder="Enter city"
                onChange={(e) => setCity(e.target.value)}
            />
            <button onClick={getWeather}>Search</button>

            <h2>{city}</h2>
            <h1>{temp}°C</h1>
            <p>{desc}</p>
        </div>
    );
}

export default WeatherCard;
