import axios from 'axios';

const API_KEY = process.env.FLIGHT_API_KEY; 

export const searchFlights = async (req, res) => {
  try {
    const { origin, destination, date } = req.query;

    // Example endpoint for Aviationstack
    const response = await axios.get(
      `http://api.aviationstack.com/v1/flights`,
      {
        params: {
          access_key: API_KEY,
          dep_iata: origin,
          arr_iata: destination,
          flight_date: date
        }
      }
    );

    const flights = response.data.data; 
    res.json(flights);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
