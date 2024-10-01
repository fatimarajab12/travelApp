const axios = require('axios');
const { getWeather } = require('../getWeather'); 

jest.mock('axios'); // Mock axios for testing

describe('getWeather', () => {
    const apiKey = 'your_api_key'; // Use a valid API key for tests

    it('should return weather data for valid input', async () => {
        const mockResponse = {
            data: {
                data: [
                    {
                        weather: { description: 'Clear sky' },
                        temp: 25,
                        app_max_temp: 30,
                        app_min_temp: 20
                    }
                ]
            }
        };

        axios.get.mockResolvedValue(mockResponse); // Mock the axios GET request

        const result = await getWeather(12.34, 56.78, 7, apiKey);
        
        expect(result).toEqual({
            description: 'Clear sky',
            temp: 25,
            app_max_temp: 30,
            app_min_temp: 20
        });
    });

    it('should return an error message for negative requested days', async () => {
        const result = await getWeather(12.34, 56.78, -1, apiKey);
        expect(result).toEqual({ message: "Invalid date: cannot fetch weather for the past.", error: true });
    });

    it('should return an error message when the API call fails', async () => {
        axios.get.mockRejectedValue(new Error('Request failed')); // Mock a failed request
        
        const result = await getWeather(12.34, 56.78, 7, apiKey);
        expect(result).toEqual({ message: 'Error fetching weather data: Request failed', error: true });
    });
});
