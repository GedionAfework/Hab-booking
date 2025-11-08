import React, { useCallback, useEffect, useState } from "react";
import API from "../services";
import ModalDialog from "../components/ModalDialog";
import ConfirmDialog from "../components/ConfirmDialog";
import MyListings from "../components/MyListings";
import { toast } from "react-toastify";

export default function Dashboard() {
  const [ownerBookings, setOwnerBookings] = useState([]); // for owners
  const [userBookings, setUserBookings] = useState([]); // user's own bookings
  const [isOwner, setIsOwner] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // bookingId while acting
  const user = JSON.parse(localStorage.getItem("user") || "null");
  // For booking creation demonstration:
  const [showCreateBooking, setShowCreateBooking] = useState(false);
  const [form, setForm] = useState({ listingId: '', listingType: '', totalPrice: '' });

  // New: create house/car listing modals
  const initialHouseForm = {
    name: '',
    type: '',
    description: '',
    price: '',
    currency: 'ETB',
    bedroom: '',
    bathroom: '',
    kitchen: '',
    livingRoom: '',
    size: '',
    sizeStandard: 'sqm',
    images: null,
  };
  const initialCarForm = {
    make: '',
    model: '',
    year: '',
    mileage: '',
    fuelType: '',
    transmission: '',
    seats: '',
    price: '',
    currency: 'ETB',
    images: null,
  };

  const [showCreateHouse, setShowCreateHouse] = useState(false);
  const [houseForm, setHouseForm] = useState(initialHouseForm);

  const [showCreateCar, setShowCreateCar] = useState(false);
  const [carForm, setCarForm] = useState(initialCarForm);

  const resetHouseForm = () => setHouseForm({ ...initialHouseForm });
  const resetCarForm = () => setCarForm({ ...initialCarForm });

  const [editingListing, setEditingListing] = useState(null);
  const editingHouseId = editingListing?.type === 'house' ? editingListing.id : null;
  const editingCarId = editingListing?.type === 'car' ? editingListing.id : null;

  const handleOpenHouseModal = () => {
    resetHouseForm();
    setEditingListing(null);
    setShowCreateHouse(true);
  };
  const handleOpenCarModal = () => {
    resetCarForm();
    setEditingListing(null);
    setShowCreateCar(true);
  };
  const handleCloseHouseModal = () => {
    setShowCreateHouse(false);
    resetHouseForm();
    setEditingListing(null);
  };
  const handleCloseCarModal = () => {
    setShowCreateCar(false);
    resetCarForm();
    setEditingListing(null);
  };

  // My listings (houses/cars) for simple cards
  const [myHouses, setMyHouses] = useState([]);
  const [myCars, setMyCars] = useState([]);

  // Fetch user and owner bookings
  const refreshBookings = useCallback(async () => {
    try {
      // My bookings as user
      const myRes = await API.get("/bookings/my/bookings");
      setUserBookings(myRes.data);
      // Try fetching as owner
      try {
        const ownerRes = await API.get("/bookings/owner/bookings");
        setOwnerBookings(ownerRes.data);
        setIsOwner(ownerRes.data.length > 0);
      } catch {
        setOwnerBookings([]);
        setIsOwner(false);
      }
      // Fetch listings to show my cards
      try {
        const [housesRes, carsRes] = await Promise.all([
          API.get('/houses'),
          API.get('/cars')
        ]);
        const uid = user?._id;
        setMyHouses(housesRes.data.filter(h => h.owner?._id === uid));
        setMyCars(carsRes.data.filter(c => c.owner?._id === uid));
      } catch {
        setMyHouses([]);
        setMyCars([]);
      }
    } catch {
      toast.error("Error loading bookings");
    }
  }, [user]);
  useEffect(() => {
    refreshBookings();
  }, [refreshBookings]);

  // Booking creation (no manual owner field)
  const handleCreateBooking = async (e) => {
    e.preventDefault();
    try {
      await API.post("/bookings", form);
      toast.success("Booking requested!");
      setShowCreateBooking(false);
      setForm({ listingId: '', listingType: '', totalPrice: '' });
      refreshBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    }
  };

  // Owner approves/rejects a booking
  const handleStatusChange = async (bookingId, newStatus) => {
    setPendingAction(bookingId + '-' + newStatus);
    try {
      await API.patch(`/bookings/owner/bookings/${bookingId}/status`, { status: newStatus });
      toast.success(`Booking ${newStatus}`);
      refreshBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setPendingAction(null);
    }
  };

  // Create / Update House Listing
  const handleCreateHouse = async (e) => {
    e.preventDefault();
    try {
      const files = houseForm.images ? Array.from(houseForm.images) : [];
      const hasNewImages = files.length > 0;
      if (!editingHouseId && files.length < 5) {
        toast.error('Please upload at least 5 images to create a listing');
        return;
      }
      if (editingHouseId && hasNewImages && files.length < 5) {
        toast.error('Please upload at least 5 images when replacing existing ones');
        return;
      }
      const fd = new FormData();
      fd.append('name', houseForm.name);
      fd.append('type', houseForm.type);
      fd.append('description', houseForm.description);
      fd.append('price', String(houseForm.price));
      fd.append('currency', houseForm.currency);
      fd.append('bedroom', String(houseForm.bedroom));
      fd.append('bathroom', String(houseForm.bathroom));
      fd.append('kitchen', String(houseForm.kitchen));
      fd.append('livingRoom', String(houseForm.livingRoom));
      fd.append('size', String(houseForm.size));
      fd.append('sizeStandard', houseForm.sizeStandard);
      files.forEach((file) => fd.append('images', file));

      if (editingHouseId) {
        await API.put(`/houses/${editingHouseId}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('House updated');
      } else {
        await API.post('/houses', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('House listed successfully');
      }
      handleCloseHouseModal();
      refreshBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save house listing');
    }
  };

  // Create / Update Car Listing
  const handleCreateCar = async (e) => {
    e.preventDefault();
    try {
      const files = carForm.images ? Array.from(carForm.images) : [];
      const hasNewImages = files.length > 0;
      if (!editingCarId && files.length < 5) {
        toast.error('Please upload at least 5 images to create a listing');
        return;
      }
      if (editingCarId && hasNewImages && files.length < 5) {
        toast.error('Please upload at least 5 images when replacing existing ones');
        return;
      }
      const fd = new FormData();
      fd.append('make', carForm.make);
      fd.append('model', carForm.model);
      fd.append('year', String(carForm.year));
      if (carForm.mileage) fd.append('mileage', String(carForm.mileage));
      fd.append('fuelType', carForm.fuelType);
      fd.append('transmission', carForm.transmission);
      fd.append('seats', String(carForm.seats));
      fd.append('price', String(carForm.price));
      fd.append('currency', carForm.currency);
      files.forEach((file) => fd.append('images', file));

      if (editingCarId) {
        await API.put(`/cars/${editingCarId}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Car updated');
      } else {
        await API.post('/cars', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Car listed successfully');
      }
      handleCloseCarModal();
      refreshBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save car listing');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button className="inline-flex items-center rounded-md bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow hover:from-indigo-500 hover:to-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-600 focus:ring-offset-2" onClick={() => setShowCreateBooking(true)}>
          Create New Booking (Demo Form)
        </button>
        <button className="inline-flex items-center rounded-md bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow hover:from-emerald-500 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2" onClick={handleOpenHouseModal}>
          Create House Listing
        </button>
        <button className="inline-flex items-center rounded-md bg-gradient-to-r from-slate-800 to-gray-700 px-4 py-2 text-sm font-semibold text-white shadow hover:from-slate-700 hover:to-gray-600 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:ring-offset-2" onClick={handleOpenCarModal}>
          Create Car Listing
        </button>
      </div>

      {/* Create Booking */}
      {showCreateBooking && (
        <ModalDialog open={showCreateBooking} title="Quick Booking" onClose={() => setShowCreateBooking(false)}>
          <form onSubmit={handleCreateBooking} className="space-y-4">
            <div className="rounded-xl bg-gradient-to-r from-fuchsia-100 via-indigo-100 to-transparent p-4">
              <h3 className="text-sm font-semibold text-fuchsia-700">Instant booking</h3>
              <p className="mt-1 text-xs text-fuchsia-700/70">
                Provide the listing ID, choose the type, and set the total price you negotiated with the owner.
              </p>
            </div>
            <label className="block text-sm font-medium text-gray-700">
              Listing ID
              <input
                name="listingId"
                placeholder="e.g. 65f1c... (24 chars)"
                value={form.listingId}
                onChange={e => setForm({ ...form, listingId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-fuchsia-600 focus:ring-fuchsia-600"
                required
              />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Listing Type
              <select
                name="listingType"
                value={form.listingType}
                onChange={e => setForm({ ...form, listingType: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-fuchsia-600 focus:ring-fuchsia-600"
                required
              >
                <option value="">Select type</option>
                <option value="house">House</option>
                <option value="car">Car</option>
                <option value="flight">Flight</option>
              </select>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Total Price
              <input
                type="number"
                name="totalPrice"
                placeholder="Total price"
                value={form.totalPrice}
                onChange={e => setForm({ ...form, totalPrice: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-fuchsia-600 focus:ring-fuchsia-600"
                required
              />
            </label>
            <button className="inline-flex w-full items-center justify-center rounded-md bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-fuchsia-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-600 focus:ring-offset-2">
              Book Listing
            </button>
          </form>
        </ModalDialog>
      )}

      {/* Create House Listing */}
      {showCreateHouse && (
        <ModalDialog
          open={showCreateHouse}
          title={editingHouseId ? "Edit House Listing" : "Create House Listing"}
          onClose={handleCloseHouseModal}
        >
          <form onSubmit={handleCreateHouse} className="space-y-5">
            <div className="rounded-2xl bg-gradient-to-r from-fuchsia-100 via-pink-100 to-white p-4">
              <h3 className="text-sm font-semibold text-fuchsia-700">
                {editingHouseId ? 'Update your house details' : 'Share a unique stay'}
              </h3>
              <p className="mt-1 text-xs text-fuchsia-700/70">
                {editingHouseId
                  ? 'Adjust any field below. Existing photos stay untouched unless you upload a fresh set of at least five images.'
                  : 'Fill in the essentials, set a nightly rate, and upload at least five vibrant images to attract guests.'}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-gray-700">
                Name
                <input
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-fuchsia-600 focus:ring-fuchsia-600"
                  placeholder="Modern Loft"
                  value={houseForm.name}
                  onChange={e => setHouseForm({ ...houseForm, name: e.target.value })}
                  required
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Type
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-fuchsia-600 focus:ring-fuchsia-600"
                  value={houseForm.type}
                  onChange={e => setHouseForm({ ...houseForm, type: e.target.value })}
                  required
                >
                  <option value="">Select type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="studio">Studio</option>
                  <option value="villa">Villa</option>
                </select>
              </label>
              <label className="sm:col-span-2 text-sm font-medium text-gray-700">
                Description
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-fuchsia-600 focus:ring-fuchsia-600"
                  rows={3}
                  placeholder="Highlight standout amenities, neighborhood, and vibe"
                  value={houseForm.description}
                  onChange={e => setHouseForm({ ...houseForm, description: e.target.value })}
                  required
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Price
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-fuchsia-600 focus:ring-fuchsia-600"
                  placeholder="4500"
                  value={houseForm.price}
                  onChange={e => setHouseForm({ ...houseForm, price: e.target.value })}
                  required
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Currency
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-fuchsia-600 focus:ring-fuchsia-600"
                  value={houseForm.currency}
                  onChange={e => setHouseForm({ ...houseForm, currency: e.target.value })}
                >
                  <option value="ETB">ETB</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </label>
              <label className="text-sm font-medium text-gray-700">
                Bedrooms
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-fuchsia-600 focus:ring-fuchsia-600"
                  value={houseForm.bedroom}
                  onChange={e => setHouseForm({ ...houseForm, bedroom: e.target.value })}
                  required
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Bathrooms
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-fuchsia-600 focus:ring-fuchsia-600"
                  value={houseForm.bathroom}
                  onChange={e => setHouseForm({ ...houseForm, bathroom: e.target.value })}
                  required
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Kitchens
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-fuchsia-600 focus:ring-fuchsia-600"
                  value={houseForm.kitchen}
                  onChange={e => setHouseForm({ ...houseForm, kitchen: e.target.value })}
                  required
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Living rooms
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-fuchsia-600 focus:ring-fuchsia-600"
                  value={houseForm.livingRoom}
                  onChange={e => setHouseForm({ ...houseForm, livingRoom: e.target.value })}
                  required
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Size
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-fuchsia-600 focus:ring-fuchsia-600"
                  value={houseForm.size}
                  onChange={e => setHouseForm({ ...houseForm, size: e.target.value })}
                  required
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Size unit
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-fuchsia-600 focus:ring-fuchsia-600"
                  value={houseForm.sizeStandard}
                  onChange={e => setHouseForm({ ...houseForm, sizeStandard: e.target.value })}
                >
                  <option value="sqm">sqm</option>
                  <option value="sqft">sqft</option>
                </select>
              </label>
            </div>

            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/60 p-4">
              <label className="block text-sm font-semibold text-gray-700">
                Upload images
                <span className="ml-2 rounded-full bg-fuchsia-100 px-2 py-0.5 text-xs font-medium text-fuchsia-700">
                  minimum 5
                </span>
              </label>
              <p className="mt-1 text-xs text-gray-500">
                {editingHouseId
                  ? 'Upload at least five new photos only if you want to replace the current gallery.'
                  : 'Choose five or more high-quality images to showcase the space.'}
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                className="mt-3 block w-full cursor-pointer rounded-md border border-dashed border-gray-300 bg-white p-2 text-sm text-gray-600"
                onChange={e => setHouseForm({ ...houseForm, images: e.target.files })}
                required={!editingHouseId}
              />
            </div>

            <button className="inline-flex w-full items-center justify-center rounded-md bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-fuchsia-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-600 focus:ring-offset-2">
              {editingHouseId ? 'Save listing' : 'Create listing'}
            </button>
          </form>
        </ModalDialog>
      )}

      {/* Create Car Listing */}
      {showCreateCar && (
        <ModalDialog
          open={showCreateCar}
          title={editingCarId ? "Edit Car Listing" : "Create Car Listing"}
          onClose={handleCloseCarModal}
        >
          <form onSubmit={handleCreateCar} className="space-y-5">
            <div className="rounded-2xl bg-gradient-to-r from-emerald-100 via-teal-100 to-white p-4">
              <h3 className="text-sm font-semibold text-emerald-700">
                {editingCarId ? 'Refresh your vehicle details' : 'List a ride travelers will love'}
              </h3>
              <p className="mt-1 text-xs text-emerald-700/70">
                {editingCarId
                  ? 'Update specs, pricing, or upload five new images to refresh the gallery.'
                  : 'Share make, model, and condition, then upload at least five stunning photos.'}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-gray-700">
                Make
                <input
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600"
                  placeholder="Toyota"
                  value={carForm.make}
                  onChange={e => setCarForm({ ...carForm, make: e.target.value })}
                  required
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Model
                <input
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600"
                  placeholder="RAV4"
                  value={carForm.model}
                  onChange={e => setCarForm({ ...carForm, model: e.target.value })}
                  required
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Year
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600"
                  value={carForm.year}
                  onChange={e => setCarForm({ ...carForm, year: e.target.value })}
                  required
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Mileage (optional)
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600"
                  value={carForm.mileage || ''}
                  onChange={e => setCarForm({ ...carForm, mileage: e.target.value })}
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Fuel type
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600"
                  value={carForm.fuelType}
                  onChange={e => setCarForm({ ...carForm, fuelType: e.target.value })}
                  required
                >
                  <option value="">Select fuel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </label>
              <label className="text-sm font-medium text-gray-700">
                Transmission
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600"
                  value={carForm.transmission}
                  onChange={e => setCarForm({ ...carForm, transmission: e.target.value })}
                  required
                >
                  <option value="">Select transmission</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </label>
              <label className="text-sm font-medium text-gray-700">
                Seats
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600"
                  value={carForm.seats}
                  onChange={e => setCarForm({ ...carForm, seats: e.target.value })}
                  required
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Price
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600"
                  value={carForm.price}
                  onChange={e => setCarForm({ ...carForm, price: e.target.value })}
                  required
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Currency
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600"
                  value={carForm.currency}
                  onChange={e => setCarForm({ ...carForm, currency: e.target.value })}
                >
                  <option value="ETB">ETB</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </label>
            </div>

            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/60 p-4">
              <label className="block text-sm font-semibold text-gray-700">
                Upload images
                <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  minimum 5
                </span>
              </label>
              <p className="mt-1 text-xs text-gray-500">
                {editingCarId
                  ? 'Add at least five new images if you want to refresh the gallery.'
                  : 'Choose five or more crisp images showing interior, exterior, and unique angles.'}
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                className="mt-3 block w-full cursor-pointer rounded-md border border-dashed border-gray-300 bg-white p-2 text-sm text-gray-600"
                onChange={e => setCarForm({ ...carForm, images: e.target.files })}
                required={!editingCarId}
              />
            </div>

            <button className="inline-flex w-full items-center justify-center rounded-md bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-emerald-500 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2">
              {editingCarId ? 'Save listing' : 'Create listing'}
            </button>
          </form>
        </ModalDialog>
      )}

      {/* OWNER BOOKINGS */}
      {isOwner && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Bookings To Approve (Owner)</h3>
          <ul>
            {ownerBookings.map(b => (
              <li key={b._id} className="flex items-center gap-4 mb-2">
                <div>
                  <span className="font-bold">{b.listingType.toUpperCase()}</span> — {b.listing && b.listing._id} — Booked By: {b.user?.name} ({b.user?.email}) — Price: ${b.totalPrice} — <span className="italic">Status: {b.status}</span>
                </div>
                {b.status === "pending" && (
                  <>
                    <button className="bg-green-500 text-white px-2 rounded" disabled={pendingAction===b._id+'-confirmed'} onClick={() => handleStatusChange(b._id, "confirmed")}>{pendingAction===b._id+'-confirmed' ? "..." : "Approve"}</button>
                    <button className="bg-red-500 text-white px-2 rounded" disabled={pendingAction===b._id+'-rejected'} onClick={() => handleStatusChange(b._id, "rejected")}>{pendingAction===b._id+'-rejected' ? "..." : "Reject"}</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <MyListings
        houses={myHouses}
        cars={myCars}
        onEdit={(item, type) => {
          if (type === 'house') {
            setEditingListing({ type: 'house', id: item._id });
            setHouseForm({
              ...initialHouseForm,
              name: item.name,
              type: item.type,
              description: item.description,
              price: item.price,
              currency: item.currency,
              bedroom: item.bedroom,
              bathroom: item.bathroom,
              kitchen: item.kitchen,
              livingRoom: item.livingRoom,
              size: item.size,
              sizeStandard: item.sizeStandard || 'sqm',
              images: null,
            });
            setShowCreateHouse(true);
          } else {
            setEditingListing({ type: 'car', id: item._id });
            setCarForm({
              ...initialCarForm,
              make: item.make,
              model: item.model,
              year: item.year,
              mileage: item.mileage || '',
              fuelType: item.fuelType,
              transmission: item.transmission,
              seats: item.seats,
              price: item.price,
              currency: item.currency,
              images: null,
            });
            setShowCreateCar(true);
          }
        }}
        onDelete={async (item, type) => {
          try {
            if (type === 'house') await API.delete(`/houses/${item._id}`);
            else await API.delete(`/cars/${item._id}`);
            toast.success('Listing deleted');
            setEditingListing(null);
            refreshBookings();
          } catch (err) {
            toast.error(err.response?.data?.message || 'Delete failed');
          }
        }}
        onToggleHide={async (item, type) => {
          try {
            const payload = { hidden: !item.hidden };
            if (type === 'house') await API.put(`/houses/${item._id}`, payload);
            else await API.put(`/cars/${item._id}`, payload);
            toast.success(item.hidden ? 'Listing visible again' : 'Listing hidden');
            refreshBookings();
          } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
          }
        }}
      />

      {/* USER BOOKINGS */}
      <div>
          <h3 className="text-xl font-semibold mb-2">My Bookings</h3>
          <ul>
          {userBookings.map(b => (
            <li key={b._id} className="mb-2">
              <div>
                <span className="font-bold">{b.listingType.toUpperCase()}</span>: {b.listing && b.listing._id} — Owned By: {b.listing?.owner?.name || "Unknown"} ({b.listing?.owner?.email || ""}) — Price: ${b.totalPrice} — <span className="italic">Status: {b.status}</span>
              </div>
              </li>
            ))}
          </ul>
      </div>
    </div>
  );
}
