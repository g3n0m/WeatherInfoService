import React from "react";
import { useState, useEffect } from "react";
import axios from "axios"; 
import "../styles/Forecast.css";

// переменные apiKeyValue, geolocationKeyValue вынесены в отдельный,
// неиндексируемый git-ом файл (с целью безопасности)
import { apiKey, geolocationKey } from "../../const";

function WeatherInfo() {
    const [city, setCity] = useState('Москва'); // отслеживаем изменение города
    const [lat, setLat] = useState('55.4507') // по умолчанию координаты города Москва
    const [lon, setLon] = useState('37.3656') // по умолчанию координаты города Москва
    const [weather, setWeather] = useState([]);
    const [wind, setWind]= useState([]);
    const [hour, setHour] = useState([]);
    const [daily, setDaily] = useState([]);
    const [daily_weather, setDaily_weather] = useState([]);
    const [feels_like, setFeels_like] = useState([]);
    const cityList = ['Москва', 'Самара', 'Анадырь', 'Санкт-Петербург','Магадан', 'Новосибирск', 'Екатеринбург', 'Казань', 'Нижний Новгород',
    'Челябинск', 'Ростов-на-Дону', 'Уфа', 'Омск', 'Красноярск', 'Воронеж', 'Пермь', 'Волгоград', 'Якутск'];

    // Наполняем содержимое select
    const options = cityList.map((text, index) => {
        return <option key={index}>{text}</option>;
    });

    // Функции вычисления текущей геопзиции
    function getMyPosition() {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
    function onSuccess(geolocationData) {
        setLoading(true);
        setLat(geolocationData.coords.latitude);
        setLon(geolocationData.coords.longitude);
        axios.get(`https://api.ipgeolocation.io/timezone?apiKey=${geolocationKey}&lat=${lat}&lng=${lon}`).then(res => {
            setCity(res.data.geo.city);
            setLoading(false);
        });
    }
    function onError(error) {
        console.log('Не удалось определить местоположение');
        console.log(error.message);
    }

    useEffect(() => {
        axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city},rus&APPID=${apiKey}&units=metric&lang=ru`).then(res => {
            console.log(res);
            setCity(res.data.name);
            setWeather(res.data.main);
            setFeels_like(res.data.main.feels_like);
            setWind(res.data.wind);
            setLat(res.data.coord.lat);
            setLon(res.data.coord.lon);
        });
        axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&lang=en&APPID=${apiKey}`).then(res => {
            console.log(res);
            setHour(res.data.hourly);
            setDaily(
                res.data.daily.map(
                    y => <div key={y.dt}>{
                        new Date(y.dt * 1000).toLocaleDateString()
                    }</div>
                )
            );
            setDaily_weather(res.data.daily);
        });
    }, [city, apiKey]);

    return (
        <div className="container">
            <div className="weatherBox">
                <div className="item underline">
                    <div className="itemLeft">Выбрать город:</div>
                    <div className="itemRight">
                        <select value={city} onChange={e=>setCity(e.target.value)}>
                            <option disabled>Выберите город</option>
                            {options}
                        </select>
                    </div>
                </div>
                <div className="item">
                    <div className="itemLeft">Температура</div>
                    <div className="itemRight">{weather.temp}&deg;C</div>
                </div>
                <div className="item">
                    <div className="itemLeft">Ощущается как</div>
                    <div className="itemRight">{feels_like} &deg;C</div>
                </div>
                <div className="item">
                    <div className="itemLeft">Атмосферное давление</div>
                    <div className="itemRight">{weather.pressure} мм.рт.ст</div>
                </div>
                <div className="item">
                    <div className="itemLeft">Влажность</div>
                    <div className="itemRight">{weather.humidity} мм</div>
                </div>
                <div className="item">
                    <div className="itemLeft">Скорость ветра</div>
                    <div className="itemRight">{wind.speed} м/с</div>
                </div>
                <div className="item spaceBefore">
                    <div className="itemLeft">На 48 часов:</div>
                </div>
                <div className="item">
                    <div className="hourly">
                        {hour.map((value,counter) =>
                            <div key={value.dt}>Час {counter + 1} : {value.temp} &deg;C</div>
                        )}
                    </div>
                </div>
                <div className="item spaceBefore">
                    <div className="itemLeft">На неделю:</div>
                </div>
                <div className="item spaceAfter">
                    <div className="itemLeft">{daily}</div>
                    <div className="itemRight">
                        {daily_weather.map((value) =>
                            <div key={value.dt}>{value.temp.day} &deg;C</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WeatherInfo;