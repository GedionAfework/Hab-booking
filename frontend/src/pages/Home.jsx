import React, { useEffect, useState } from "react";
import {
  IoAirplaneOutline,
  IoHomeOutline,
  IoCarSportOutline,
  IoCalendarOutline,
  IoChevronBack,
  IoChevronForward,
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
    icon: <IoAirplaneOutline className="text-2xl text-blue-600" />,
    title: "Exclusive flight deals",
    description: "Save big on top airlines worldwide.",
  },
  {
    icon: <IoHomeOutline className="text-2xl text-emerald-600" />,
    title: "Homes for every vibe",
    description: "From city apartments to seaside villas.",
  },
  {
    icon: <IoCarSportOutline className="text-2xl text-orange-600" />,
    title: "Drive with ease",
    description: "Comfortable rentals ready when you land.",
  },
  {
    icon: <IoCalendarOutline className="text-2xl text-purple-600" />,
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

const Home = () => {
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

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const handleSearch = ({ type }) => {
    const destinations = {
      flights: "/flights",
      houses: "/houses",
      cars: "/cars",
    };
    const href = destinations[type];
    if (href) window.location.href = href;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative h-[600px] overflow-hidden">
        {heroSlides.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
          >
            <img src={image} alt="destination" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
          </div>
        ))}

        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/30 p-3 text-white backdrop-blur transition hover:bg-white/50"
        >
          <IoChevronBack className="text-2xl" />
        </button>
        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/30 p-3 text-white backdrop-blur transition hover:bg-white/50"
        >
          <IoChevronForward className="text-2xl" />
        </button>

        <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-4 text-center text-white">
          <h1 className="text-4xl font-bold leading-tight drop-shadow-md md:text-6xl">Your journey starts here</h1>
          <p className="mt-4 max-w-3xl text-base text-white/80 md:text-lg">
            Discover inspiring destinations, uncover unbeatable deals, and plan every detail of your perfect trip with Hab Booking.
          </p>
          <div className="mt-10 w-full">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-12 max-w-6xl px-4 md:-mt-16">
        <div className="grid gap-6 md:grid-cols-4">
          {featureCards.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-white bg-white p-6 shadow-sm">
              {feature.icon}
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured deals</h2>
            <p className="text-sm text-gray-500">Handpicked from our latest homes and cars</p>
          </div>
          <button className="rounded-full border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-600 shadow-sm transition hover:border-blue-500 hover:text-blue-600">
            View all listings
          </button>
        </div>
        {loadingDeals ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-64 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : featuredDeals.length === 0 ? (
          <div className="rounded-2xl border border-white bg-white p-12 text-center text-gray-500 shadow-sm">
            No featured listings yet. Create your first house or car listing from the dashboard.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featuredDeals.map((deal) => (
              <DealCard
                key={deal.id}
                image={deal.image}
                title={deal.title}
                location={deal.location}
                price={deal.price}
                rating={deal.rating}
                badge={deal.badge}
                onSelect={() => handleSearch({ type: deal.type })}
              />
            ))}
          </div>
        )}
      </section>

      <section className="bg-blue-50 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900">Why travelers love Hab Booking</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.title} className="rounded-2xl border border-blue-100 bg-white p-6 text-center shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-3 text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
