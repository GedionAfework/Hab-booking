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
    icon: <IoAirplaneOutline className="text-xl text-gray-700 dark:text-gray-200" />,
    title: "Exclusive flight deals",
    description: "Save big on top airlines worldwide.",
  },
  {
    icon: <IoHomeOutline className="text-xl text-gray-700 dark:text-gray-200" />,
    title: "Homes for every vibe",
    description: "From city apartments to seaside villas.",
  },
  {
    icon: <IoCarSportOutline className="text-xl text-gray-700 dark:text-gray-200" />,
    title: "Drive with ease",
    description: "Comfortable rentals ready when you land.",
  },
  {
    icon: <IoCalendarOutline className="text-xl text-gray-700 dark:text-gray-200" />,
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
    <div className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-gray-100">
      <section className="relative overflow-hidden">
        {heroSlides.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
          >
            <img src={image} alt="hero" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-white/75 dark:bg-black/70" />
          </div>
        ))}
        <div className="relative z-10 mx-auto flex min-h-[420px] max-w-5xl flex-col items-start justify-center gap-6 px-4 py-12 text-gray-900 dark:text-white">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gray-500 dark:text-gray-400">Hab Booking</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-gray-900 dark:text-white md:text-5xl">
              Plan, book, and manage your trips in one place.
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-gray-700 dark:text-gray-300">
              Find curated flights, homes, and cars with transparent pricing and flexible options. Search once, compare instantly, and lock in your itinerary.
            </p>
          </div>
          <div className="w-full">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
        <button
          type="button"
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-6 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/30 p-3 text-white backdrop-blur transition hover:bg-white/50"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-6 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/30 p-3 text-white backdrop-blur transition hover:bg-white/50"
        >
          ›
        </button>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 bg-white dark:bg-black">
        <div className="grid gap-4 md:grid-cols-4">
          {featureCards.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-orange-200 bg-orange-100 p-5 shadow-sm dark:border-gray-800 dark:bg-slate-900"
            >
              {feature.icon}
              <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-black">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Featured deals</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Handpicked from our latest homes and cars
              </p>
            </div>
            <button className="text-sm font-semibold text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white">
              View all listings
            </button>
          </div>
          {loadingDeals ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="h-64 rounded-2xl bg-gray-200 animate-pulse dark:bg-gray-700" />
              ))}
            </div>
          ) : featuredDeals.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-600 dark:border-gray-800 dark:bg-slate-900 dark:text-gray-400">
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
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 bg-white dark:bg-black">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Why travelers love Hab Booking
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-orange-200 bg-orange-100 p-6 shadow-sm dark:border-gray-800 dark:bg-slate-900"
            >
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
              <p className="mt-3 text-sm text-gray-700 dark:text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
