import { useState } from "react";

function WeatherCard() {
    const [city, setCity] = useState("");
    const [temp, setTemp] = useState(null);
    const [desc, setDesc] = useState("");
    const [icon, setIcon] = useState("");
    const [weatherType, setWeatherType] = useState("");
    const [isNight, setIsNight] = useState(false);

    const getWeather = async () => {

        if (!city.trim()) {
            alert("Please enter a city name");
            return;
        }

        const apiKey = import.meta.env.VITE_API_KEY;

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        const data = await response.json();

        if (data.cod === 200) {
            setTemp(data.main.temp);
            setDesc(data.weather[0].description);
            setWeatherType(data.weather[0].main);
            setIcon(data.weather[0].icon);

            const iconCode = data.weather[0].icon;

            setIsNight(iconCode.includes("n"));
        } else {
            alert("City not found");
        }
    };

    return (
        <div className={`app ${weatherType} ${isNight ? "night" : "day"}`}>
            {temp !== null && (
                isNight ? (
                    <>
                        <div className="stars"></div>
                        <div className="bright-stars"></div>
                        <div className="moon"></div>
                        <div className="shooting-star"></div>

                    </>
                ) : (
                    weatherType === "Clear" && <div className="sun"></div>
                )
            )}

            {(weatherType === "Clouds" || weatherType === "Rain" || weatherType === "Mist") && (
                <>
                    <div className="cloud cloud1"></div>
                    <div className="cloud cloud2"></div>
                    <div className="cloud cloud3"></div>
                </>
            )}
            <div className="card">

                {/* Search Bar */}
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Enter city..."
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                getWeather();
                            }
                        }}
                    />

                    <button onClick={getWeather}>
                        Search
                    </button>
                </div>

                {/* Weather Info */}
                {temp !== null && (
                    <>
                        <h2>{city}</h2>
                        <h1>{temp}°C</h1>

                        <img
                            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                            alt="weather icon"
                        />

                        <p>{desc}</p>
                    </>
                )}

            </div>
        </div>
    );
}

export default WeatherCard;