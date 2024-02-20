import React, { useState, useEffect } from 'react';
import '../Styles/Weather.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import getWeatherIcon from './utils/getWeatherIcon';


interface WeatherData {
    temperature: number;
    windSpeed: number;
    humidity: number;
    weatherSymbol: number;
}

interface Parameter {
    name: string;
    values: number[];
}

const Weather = () => {
    const [visbyData, setVisbyData] = useState<WeatherData | null>(null);
    const [fårösundData, setFårösundData] = useState<WeatherData | null>(null);
    const [sliteData, setSliteData] = useState<WeatherData | null>(null);
    const [burgsvikData, setBurgsvikData] = useState<WeatherData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const fetchDataForLocation = async (lat: number, lon: number, setData: React.Dispatch<React.SetStateAction<WeatherData | null>>) => {
                const response = await fetch(`/api/vader/?lat=${lat}&lon=${lon}`);
                const data = await response.json();

                if (data.weatherData && data.weatherData.timeSeries) {
                    const currentData = data.weatherData.timeSeries[0];
                    const temperature = currentData.parameters.find((p: Parameter) => p.name === 't').values[0];
                    const windSpeed = currentData.parameters.find((p: Parameter) => p.name === 'ws').values[0];
                    const humidity = currentData.parameters.find((p: Parameter) => p.name === 'r').values[0];
                    const weatherSymbol = currentData.parameters.find((p: Parameter) => p.name === 'Wsymb2').values[0];

                    setData({
                        temperature: temperature,
                        windSpeed: windSpeed,
                        humidity: humidity,
                        weatherSymbol: weatherSymbol
                    });
                }
            };

            await Promise.all([
                fetchDataForLocation(57.637, 18.297, setVisbyData),
                fetchDataForLocation(57.903735, 18.994859, setFårösundData),
                fetchDataForLocation(57.705896, 18.783623, setSliteData),
                fetchDataForLocation(57.02971, 18.279682, setBurgsvikData)
            ]);
        };

        fetchData();
    }, []);

    if (!visbyData || !fårösundData || !sliteData || !burgsvikData) return <div>Laddar väderdata...</div>;



    return (
        <div>

            <div className="weather-container">
                <Row>
                    <Col xs="auto">
                        <div className="title-img" >
                            {getWeatherIcon(2)}
                        </div>
                    </Col>
                    <Col>
                        <div className="title-container">
                            <p className="title">Vädret på Gotland</p>
                        </div>
                    </Col>
                </Row>

                <div className="weather-display">

    <Container>
        <Row>
        <Col>
                <p className="location"> Visby </p>
                <p className="temp">
                {getWeatherIcon(visbyData.weatherSymbol)} 
                <span className="temperature">{visbyData.temperature} °</span>
               </p>
        </Col>
            <Col>
                <p className="location">Fårösund</p>
                <p className="temp">
                {getWeatherIcon(fårösundData.weatherSymbol)} 
                <span className="temperature">{fårösundData.temperature} °</span>
                </p>
            </Col>
            <Col>
                <p className="location">Slite</p>
                <p className="temp">
                {getWeatherIcon(sliteData.weatherSymbol)}           
                <span className="temperature">{sliteData.temperature} °</span>
                </p>
            </Col>
            <Col>
                 <p className="location">Burgsvik</p>
                 <p className="temp">
                 <span className="weather-icon">{getWeatherIcon(burgsvikData.weatherSymbol)}</span>
                 <span className="temperature">{burgsvikData.temperature} °</span>
             
                </p>
            </Col>
        </Row>
    </Container>                   
</div>         
<p className="smhi">Källa: SMHI</p>
            </div>      
        </div>
    );
};

export default Weather;
