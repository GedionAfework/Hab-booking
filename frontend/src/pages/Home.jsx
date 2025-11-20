import React, { useEffect, useState } from "react";
import {
  IoAirplaneOutline,
  IoHomeOutline,
  IoCarSportOutline,
  IoCalendarOutline,
} from "react-icons/io5";
import SearchBar from "../components/SearchBar";
import DealCard from "../components/DealCard";
import API, { UPLOADS_BASE } from "../services";

const heroSlides = [
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&h=900&fit=crop",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&h=900&fit=crop",
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&h=900&fit=crop",
];

const featureCards = [
  {
    icon: <IoAirplaneOutline className="text-3xl md:text-4xl text-blue-600 dark:text-blue-400" />,
    title: "Exclusive flight deals",
    description: "Save big on top airlines worldwide.",
  },
  {
    icon: <IoHomeOutline className="text-3xl md:text-4xl text-blue-600 dark:text-blue-400" />,
    title: "Homes for every vibe",
    description: "From city apartments to seaside villas.",
  },
  {
    icon: <IoCarSportOutline className="text-3xl md:text-4xl text-blue-600 dark:text-blue-400" />,
    title: "Drive with ease",
    description: "Comfortable rentals ready when you land.",
  },
  {
    icon: <IoCalendarOutline className="text-3xl md:text-4xl text-blue-600 dark:text-blue-400" />,
    title: "Flexible stays",
    description: "Free cancellation on most bookings.",
  },
];

const highlights = [
  {
    title: "Best Prices",
    description: "We guarantee unbeatable deals on flights, homes, and car rentals.",
  },
  {
    title: "24/7 Support",
    description: "Our travel experts are ready around the clock to help you plan.",
  },
  {
    title: "Trusted Worldwide",
    description: "Join millions of happy travelers booking with confidence.",
  },
];

const resolveImage = (src) => {
  if (!src) return null;
  return src.startsWith("/uploads") ? `${UPLOADS_BASE}${src}` : src;
};

const formatDeal = (item, type) => {
  const image = resolveImage(item.images?.[0]);
  return {
    id: item._id,
    image,
    title:
      type === "house"
        ? item.name
        : item.name || `${item.make || ""} ${item.model || ""}`.trim() || "Car rental",
    location: item.location?.city || item.location?.country || item.location || type === "car" ? item.make : "",
    price: `${item.price} ${item.currency || "ETB"}`,
    rating: item.rating || 4.8,
    badge: item.hidden ? "Hidden" : undefined,
    type,
  };
};

const Home = ({ onNavigate }) => {
  const [featuredDeals, setFeaturedDeals] = useState([]);
  const [loadingDeals, setLoadingDeals] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const [housesRes, carsRes] = await Promise.all([API.get("/houses"), API.get("/cars")]);
        const houses = (housesRes.data || []).filter((h) => !h.hidden);
        const cars = (carsRes.data || []).filter((c) => !c.hidden);

        const deals = [...houses.map((h) => formatDeal(h, "house")), ...cars.map((c) => formatDeal(c, "car"))]
          .filter((deal) => deal.image)
          .slice(0, 8);
        setFeaturedDeals(deals);
      } catch (err) {
        console.error("Home data error", err.response?.data || err.message);
      } finally {
        setLoadingDeals(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleSearch = ({ type }) => {
    if (onNavigate) {
      onNavigate(type);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        {heroSlides.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
          >
            <img src={image} alt="hero" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-transparent" />
          </div>
        ))}
        <div className="relative z-10 mx-auto flex min-h-[500px] max-w-6xl flex-col items-start justify-center gap-8 px-4 py-16 text-white animate-fadeIn">
          <div className="animate-slideIn">
            <p className="text-lg md:text-xl font-semibold uppercase tracking-[0.4em] text-gray-200">Hab Booking</p>
            <h1 className="mt-6 text-6xl font-bold leading-tight md:text-7xl lg:text-8xl animate-fadeIn drop-shadow-lg" style={{ animationDelay: '0.2s' }}>
              Plan, book, and manage your trips in one place.
            </h1>
            <p className="mt-8 max-w-3xl text-xl md:text-2xl text-gray-100 animate-fadeIn drop-shadow-md" style={{ animationDelay: '0.4s' }}>
              Find curated flights, homes, and cars with transparent pricing and flexible options. Search once, compare instantly, and lock in your itinerary.
            </p>
          </div>
          <div className="w-full max-w-5xl animate-fadeIn" style={{ animationDelay: '0.6s' }}>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
        <button
          type="button"
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-6 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/30 p-3 text-white backdrop-blur transition-all duration-300 hover:bg-white/50 hover:scale-110 hover:rotate-[-5deg]"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-6 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/30 p-3 text-white backdrop-blur transition-all duration-300 hover:bg-white/50 hover:scale-110 hover:rotate-[5deg]"
        >
          ›
        </button>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 bg-white dark:bg-gray-900">
        <div className="grid gap-6 md:grid-cols-4">
          {featureCards.map((feature, index) => (
            <div 
              key={feature.title} 
              className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 md:p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-105 animate-fadeIn"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="transition-transform duration-300 hover:scale-110 hover:rotate-6">
                {feature.icon}
              </div>
              <h3 className="mt-6 text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 flex items-center justify-between animate-slideIn">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Featured deals</h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mt-3">Handpicked from our latest homes and cars</p>
            </div>
            <button className="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">View all listings</button>
          </div>
          {loadingDeals ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="h-64 rounded-2xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : featuredDeals.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-12 text-center text-base md:text-lg text-gray-500 dark:text-gray-400">
              No featured listings yet. Create your first house or car listing from the dashboard.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {featuredDeals.map((deal, index) => (
                <div 
                  key={deal.id}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <DealCard
                    image={deal.image}
                    title={deal.title}
                    location={deal.location}
                    price={deal.price}
                    rating={deal.rating}
                    badge={deal.badge}
                    onSelect={() => handleSearch({ type: deal.type })}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 bg-white dark:bg-gray-900">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white animate-slideIn">Why travelers love Hab Booking</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {highlights.map((item, index) => (
            <div 
              key={item.title} 
              className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 md:p-10 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-105 animate-fadeIn"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">{item.title}</h3>
              <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
