import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object
class Weather { 
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;
 
  constructor(
    city: string, 
    date: string, 
    icon: string, 
    iconDescription: string, 
    tempF: number, 
    windSpeed: number, 
    humidity: number) 
    {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL?: string;
  private apiKey?: string;
  cityName: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
    this.cityName = '';
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    try {
      const response = await fetch(
        `${this.baseURL}/geo/1.0/direct?q=${query}&appid=${this.apiKey}`
      );

      const locationData = await response.json();
      console.log(`Location Data line 57: ${JSON.stringify(locationData)}`);

      return locationData;
    } catch (err) {
      console.log('Error:', err);
      return err;
    }
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any[]): Coordinates {
    const lat = parseFloat(locationData[0].lat);
    const lon = parseFloat(locationData[0].lon); 
    console.info(`line 68 lat: ${lat}, lon: ${lon}`);
    return { lat, lon };
  }
  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {
  //   return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&appid=${this.apiKey}`;
  // }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    console.info(`lat=${coordinates.lat} and lon=${coordinates.lon}`);
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;

  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    
    const locationData = await this.fetchLocationData(this.cityName);
    console.info(`City Name line 86: ${this.cityName}`);
    console.info(`Location Data line 87: ${JSON.stringify(locationData)}`);

    const coordinates =  this.destructureLocationData(locationData);
    console.info(`Coordinates line 91: ${coordinates}`);

    return coordinates;
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    try {
      const response = await fetch (
        this.buildWeatherQuery(coordinates)
      )
      const weatherData = await response.json();
      console.info(`Weather Data line 102: ${weatherData}`);
      return weatherData;
    } catch (err) {
      console.log('Error fetching weather data', err);
      return err;
    }
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const {name:city, dt, weather, main, wind} = response;
    console.info(`response line 112: ${JSON.stringify(response)}`);
    const date = new Date(dt * 1000).toLocaleDateString();
    const icon = weather && weather.length > 0 ? weather[0].icon : '';
    const iconDescription = weather && weather.length > 0 ? weather[0].description : '';
    const tempF = main?.temp || 0; 
    const windSpeed = wind?.speed || 0; 
    const humidity = main?.humidity || 0; 
  
    return new Weather(city, date, icon, iconDescription, tempF, windSpeed, humidity);
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecastArray = weatherData.map((data: any) => {
      const weather = this.parseCurrentWeather(data); 
       return weather;
       })

       return [currentWeather, ...forecastArray];
    ;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
  
    try {
    this.cityName = city;
    const coordinates : Coordinates = await this.fetchAndDestructureLocationData();
    console.info(`Coordinates line 138: ${coordinates.lat}, ${coordinates.lon}`);
    
    const weatherData = await this.fetchWeatherData(coordinates);
    console.info(`Weather Data line 141: ${JSON.stringify(weatherData)}`);

    const currentWeather = this.parseCurrentWeather(weatherData);

    return [this.buildForecastArray(currentWeather, [weatherData])];
    } catch (err) {
      console.log('Error getting weather for city', err);
      throw err;
  }
}
};

export default new WeatherService();
