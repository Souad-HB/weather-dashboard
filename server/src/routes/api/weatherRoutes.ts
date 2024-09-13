import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  // GET weather data from city name
  console.info(`${req.method} request received for weather data`);
  const { cityName } = req.body; 
  console.info(`${cityName} received`)
  if (cityName) {
    try {
      const weatherData = await WeatherService.getWeatherForCity(cityName);
      if (weatherData) {
        res.json(weatherData);
        // save city to search history
        await HistoryService.addCity(cityName);
      } else {
        res.status(404).send('Error in retrieving weather data');
      }
    } catch (err) {
      res.status(500).send('Error in retrieving weather data');
    }
  } else {
    res.status(400).send('City name is required');
  }
});

// GET search history
router.get('/history', async (req, res) => {
  console.info(`${req.method} request received for history`);
  try {
    const savedCities = await HistoryService.getCities();
    res.json(savedCities);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// * BONUS: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  try {
    if (!req.params.id) {
      res.status(400).send({ msg: 'City ID is required' });
    }
    await HistoryService.removeCity(req.params.id);
    res.json({ success: 'City deleted from history' });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export default router;
