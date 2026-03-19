import { useState } from "react";

function WeatherCard() {
    const [city, setCity] = useState("");
    const [temp, setTemp] = useState(null);
    const [desc, setDesc] = useState("");
    const [icon, setIcon] = useState("");
    const [weatherType, setWeatherType] = useState("");
    const [isNight, setIsNight] = useState(false);
    const [forecast, setForecast] = useState([]);
    const [sunrise, setSunrise] = useState("");
    const [sunset, setSunset] = useState("");


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

        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
        );

        const forecastData = await forecastResponse.json();
        const dailyForecast = forecastData.list.filter((item) =>
            item.dt_txt.includes("12:00:00")
        );

        setForecast(dailyForecast);



        if (data.cod === 200) {
            setTemp(data.main.temp);
            setDesc(data.weather[0].description);
            setWeatherType(data.weather[0].main);
            setIcon(data.weather[0].icon);

            const sunriseTime = new Date(data.sys.sunrise * 1000);
            const sunsetTime = new Date(data.sys.sunset * 1000);

            setSunrise(
                sunriseTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            );
            setSunset(
                sunsetTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            );


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
                        <div className="galaxy"></div>
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
                        {sunrise && sunset && (
                            <div className="sun-times">
                                <div className="sun-card">
                                    <span>🌅</span>
                                    <p>Sunrise</p>
                                    <h4>{sunrise}</h4>
                                </div>

                                <div className="sun-card">
                                    <span>🌇</span>
                                    <p>Sunset</p>
                                    <h4>{sunset}</h4>
                                </div>
                            </div>
                        )}
                        <div className="forecast">
                            {forecast.map((day, index) => {
                                const date = new Date(day.dt_txt);
                                const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

                                return (
                                    <div key={index} className="forecast-day">
                                        <p>{dayName}</p>
                                        <img
                                            src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                                        />
                                        <p className="forecast-temp">{Math.round(day.main.temp)}°C</p>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}

export default WeatherCard;