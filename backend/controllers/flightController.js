import axios from 'axios';

const API_KEY = process.env.FLIGHT_API_KEY;

const sanitizeCode = (code = '') => code.trim().toUpperCase();

const fallbackFlights = [
  {
    id: 'sample-eth-001',
    airline: 'Ethiopian Airlines',
    flightNumber: 'ET304',
    origin: 'ADD',
    destination: 'NBO',
    departureTime: '2025-01-12T08:30:00Z',
    arrivalTime: '2025-01-12T10:45:00Z',
    durationMinutes: 135,
    price: 320,
    currency: 'USD',
  },
  {
    id: 'sample-kq-002',
    airline: 'Kenya Airways',
    flightNumber: 'KQ401',
    origin: 'NBO',
    destination: 'ADD',
    departureTime: '2025-01-13T14:15:00Z',
    arrivalTime: '2025-01-13T16:25:00Z',
    durationMinutes: 130,
    price: 295,
    currency: 'USD',
  },
  {
    id: 'sample-em-003',
    airline: 'Emirates',
    flightNumber: 'EK724',
    origin: 'ADD',
    destination: 'DXB',
    departureTime: '2025-01-14T23:05:00Z',
    arrivalTime: '2025-01-15T03:15:00Z',
    durationMinutes: 250,
    price: 620,
    currency: 'USD',
  },
];

const normalizeFlights = (data = []) =>
  data
    .filter(Boolean)
    .map((flight, idx) => ({
      id: flight.flight?.iata || flight.flight?.number || `api-${idx}`,
      airline: flight.airline?.name || 'Unknown Airline',
      flightNumber: flight.flight?.iata || flight.flight?.number || '—',
      origin: flight.departure?.iata || flight.departure?.airport || '—',
      destination: flight.arrival?.iata || flight.arrival?.airport || '—',
      departureTime: flight.departure?.scheduled,
      arrivalTime: flight.arrival?.scheduled,
      durationMinutes: flight.flight_time || null,
      price: Math.floor(Math.random() * 300) + 200,
      currency: 'USD',
    }));

const getFallbackFlights = (origin, destination) => {
  const originCode = sanitizeCode(origin);
  const destinationCode = sanitizeCode(destination);
  const match = fallbackFlights.filter((f) => {
    const matchOrigin = originCode ? f.origin.includes(originCode) : true;
    const matchDest = destinationCode ? f.destination.includes(destinationCode) : true;
    return matchOrigin && matchDest;
  });
  return match.length ? match : fallbackFlights;
};

export const searchFlights = async (req, res) => {
  const origin = sanitizeCode(req.query.origin);
  const destination = sanitizeCode(req.query.destination);
  const date = req.query.date || '';

  const respondWithFallback = () =>
    res.status(200).json(getFallbackFlights(origin, destination));

  try {
    if (!API_KEY) {
      respondWithFallback();
      return;
    }

    const response = await axios.get('http://api.aviationstack.com/v1/flights', {
      params: {
        access_key: API_KEY,
        dep_iata: origin || undefined,
        arr_iata: destination || undefined,
        flight_date: date || undefined,
      },
    });

    const flights = normalizeFlights(response.data?.data) || [];

    if (!flights.length) {
      respondWithFallback();
      return;
    }

    res.json(flights);
  } catch (error) {
    console.error('Flight search error:', error.response?.data || error.message);
    respondWithFallback();
    return;
  }
};
