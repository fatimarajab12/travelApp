const axios = require('axios');
const { getCityLoc } = require('../getCityLoc'); 

jest.mock('axios'); // Mock axios for testing

describe('getCityLoc', () => {
    const username = 'test_username'; // Use a test username for the mock

    it('should return location data for a valid city', async () => {
        const mockResponse = {
            geonames: [
                {
                    name: 'New York',
                    lat: 40.7128,
                    lng: -74.0060
                }
            ]
        };

        axios.get.mockResolvedValue({ data: mockResponse }); // Mock the axios GET request

        const result = await getCityLoc('New York', username);
        
        expect(result).toEqual({
            name: 'New York',
            lat: 40.7128,
            lng: -74.0060
        });
    });

    it('should return an error message for a city not found', async () => {
        const mockResponse = { geonames: [] }; // No entries in the response
        axios.get.mockResolvedValue({ data: mockResponse }); // Mock the axios GET request

        const result = await getCityLoc('Unknown City', username);
        expect(result).toEqual({ message: "City not found", error: true });
    });

    it('should return an error message when the API call fails', async () => {
        axios.get.mockRejectedValue(new Error('Request failed')); // Mock a failed request
        
        const result = await getCityLoc('New York', username);
        expect(result).toEqual({ message: 'Error fetching city data: Request failed', error: true });
    });
});
