import React, { useEffect, useState } from "react";
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
  const [showCreateHouse, setShowCreateHouse] = useState(false);
  const [houseForm, setHouseForm] = useState({
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
    images: [] // FileList
  });

  const [showCreateCar, setShowCreateCar] = useState(false);
  const [carForm, setCarForm] = useState({
    make: '',
    model: '',
    year: '',
    mileage: '',
    fuelType: '',
    transmission: '',
    seats: '',
    price: '',
    currency: 'ETB',
    images: [] // FileList
  });

  // My listings (houses/cars) for simple cards
  const [myHouses, setMyHouses] = useState([]);
  const [myCars, setMyCars] = useState([]);

  // Fetch user and owner bookings
  const refreshBookings = async () => {
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
  };
  useEffect(() => {
    refreshBookings();
  }, []);

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

  // Create House Listing
  const handleCreateHouse = async (e) => {
    e.preventDefault();
    try {
      if (!houseForm.images || houseForm.images.length === 0) {
        toast.error('At least one image is required');
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
      Array.from(houseForm.images).forEach(file => fd.append('images', file));
      const editId = typeof pendingAction === 'string' && pendingAction.startsWith('edit-house-') ? pendingAction.replace('edit-house-','') : null;
      if (editId) {
        await API.put(`/houses/${editId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        } else {
        await API.post('/houses', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        }
      toast.success('House listed successfully');
      setShowCreateHouse(false);
      setHouseForm({ name: '', type: '', description: '', price: '', currency: 'ETB', bedroom: '', bathroom: '', kitchen: '', livingRoom: '', size: '', sizeStandard: 'sqm', images: [] });
      setPendingAction(null);
      } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create house listing');
    }
  };

  // Create Car Listing
  const handleCreateCar = async (e) => {
    e.preventDefault();
    try {
      if (!carForm.images || carForm.images.length === 0) {
        toast.error('At least one image is required');
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
      Array.from(carForm.images).forEach(file => fd.append('images', file));
      const editId = typeof pendingAction === 'string' && pendingAction.startsWith('edit-car-') ? pendingAction.replace('edit-car-','') : null;
      if (editId) {
        await API.put(`/cars/${editId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await API.post('/cars', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      toast.success('Car listed successfully');
      setShowCreateCar(false);
      setCarForm({ make: '', model: '', year: '', mileage: '', fuelType: '', transmission: '', seats: '', price: '', currency: 'ETB', images: [] });
      setPendingAction(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create car listing');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      {/* Quick actions */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => setShowCreateBooking(true)}>
          Create New Booking (Demo Form)
        </button>
        <button className="bg-slate-700 text-white px-3 py-1 rounded" onClick={() => setShowCreateHouse(true)}>
          Create House Listing
        </button>
        <button className="bg-slate-700 text-white px-3 py-1 rounded" onClick={() => setShowCreateCar(true)}>
          Create Car Listing
        </button>
      </div>

      {/* Create Booking */}
      {showCreateBooking && (
        <ModalDialog open={showCreateBooking} title="Create a Booking" onClose={() => setShowCreateBooking(false)}>
          <form onSubmit={handleCreateBooking} className="flex flex-col gap-3">
            <label className="text-sm font-medium text-gray-700">Listing ID</label>
            <input name="listingId" placeholder="e.g. 65f1c... (24 chars)" value={form.listingId} onChange={e => setForm({ ...form, listingId: e.target.value })} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-fuchsia-600 focus:ring-fuchsia-600" required />
            <label className="text-sm font-medium text-gray-700">Listing Type</label>
            <select name="listingType" value={form.listingType} onChange={e => setForm({ ...form, listingType: e.target.value })} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-fuchsia-600 focus:ring-fuchsia-600" required>
              <option value="">Listing Type</option>
              <option value="house">House</option>
              <option value="car">Car</option>
              <option value="flight">Flight</option>
            </select>
            <label className="text-sm font-medium text-gray-700">Total Price</label>
            <input type="number" name="totalPrice" placeholder="Total Price" value={form.totalPrice} onChange={e => setForm({ ...form, totalPrice: e.target.value })} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-fuchsia-600 focus:ring-fuchsia-600" required />
            <button className="inline-flex items-center rounded-md bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-fuchsia-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-600 focus:ring-offset-2 mt-1">Book</button>
          </form>
        </ModalDialog>
      )}

      {/* Create House Listing */}
      {showCreateHouse && (
        <ModalDialog open={showCreateHouse} title="Create House Listing" onClose={() => setShowCreateHouse(false)}>
          <form onSubmit={handleCreateHouse} className="flex flex-col gap-3">
            <input className="block w-full rounded-md border-gray-300 shadow-sm focus:border-fuchsia-600 focus:ring-fuchsia-600" placeholder="Name" value={houseForm.name} onChange={e=>setHouseForm({...houseForm, name:e.target.value})} required />
            <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-fuchsia-600 focus:ring-fuchsia-600" value={houseForm.type} onChange={e=>setHouseForm({...houseForm, type:e.target.value})} required>
              <option value="">Type</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="studio">Studio</option>
              <option value="villa">Villa</option>
            </select>
            <textarea className="block w-full rounded-md border-gray-300 shadow-sm focus:border-fuchsia-600 focus:ring-fuchsia-600" placeholder="Description" value={houseForm.description} onChange={e=>setHouseForm({...houseForm, description:e.target.value})} required />
            <input type="number" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-fuchsia-600 focus:ring-fuchsia-600" placeholder="Price" value={houseForm.price} onChange={e=>setHouseForm({...houseForm, price:e.target.value})} required />
            <div className="grid grid-cols-2 gap-2">
              <input type="number" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-fuchsia-600 focus:ring-fuchsia-600" placeholder="Bedrooms" value={houseForm.bedroom} onChange={e=>setHouseForm({...houseForm, bedroom:e.target.value})} required />
              <input type="number" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-fuchsia-600 focus:ring-fuchsia-600" placeholder="Bathrooms" value={houseForm.bathroom} onChange={e=>setHouseForm({...houseForm, bathroom:e.target.value})} required />
              <input type="number" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-fuchsia-600 focus:ring-fuchsia-600" placeholder="Kitchens" value={houseForm.kitchen} onChange={e=>setHouseForm({...houseForm, kitchen:e.target.value})} required />
              <input type="number" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-fuchsia-600 focus:ring-fuchsia-600" placeholder="Living Rooms" value={houseForm.livingRoom} onChange={e=>setHouseForm({...houseForm, livingRoom:e.target.value})} required />
              <input type="number" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-fuchsia-600 focus:ring-fuchsia-600" placeholder="Size" value={houseForm.size} onChange={e=>setHouseForm({...houseForm, size:e.target.value})} required />
              <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-fuchsia-600 focus:ring-fuchsia-600" value={houseForm.sizeStandard} onChange={e=>setHouseForm({...houseForm, sizeStandard:e.target.value})}>
                <option value="sqm">sqm</option>
                <option value="sqft">sqft</option>
              </select>
            </div>
            <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-fuchsia-600 focus:ring-fuchsia-600" value={houseForm.currency} onChange={e=>setHouseForm({...houseForm, currency:e.target.value})}>
              <option value="ETB">ETB</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
            <input type="file" accept="image/*" multiple className="block w-full rounded-md border border-dashed border-gray-300 p-2 text-sm text-gray-600" onChange={e=>setHouseForm({...houseForm, images:e.target.files})} required />
            <button className="inline-flex items-center rounded-md bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-fuchsia-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-600 focus:ring-offset-2">Create</button>
          </form>
        </ModalDialog>
      )}

      {/* Create Car Listing */}
      {showCreateCar && (
        <ModalDialog open={showCreateCar} title="Create Car Listing" onClose={() => setShowCreateCar(false)}>
          <form onSubmit={handleCreateCar} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              <input className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600" placeholder="Make" value={carForm.make} onChange={e=>setCarForm({...carForm, make:e.target.value})} required />
              <input className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600" placeholder="Model" value={carForm.model} onChange={e=>setCarForm({...carForm, model:e.target.value})} required />
              <input type="number" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600" placeholder="Year" value={carForm.year} onChange={e=>setCarForm({...carForm, year:e.target.value})} required />
              <input type="number" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600" placeholder="Mileage (optional)" value={carForm.mileage} onChange={e=>setCarForm({...carForm, mileage:e.target.value})} />
              <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600" value={carForm.fuelType} onChange={e=>setCarForm({...carForm, fuelType:e.target.value})} required>
                <option value="">Fuel Type</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
              <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600" value={carForm.transmission} onChange={e=>setCarForm({...carForm, transmission:e.target.value})} required>
                <option value="">Transmission</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
              <input type="number" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600" placeholder="Seats" value={carForm.seats} onChange={e=>setCarForm({...carForm, seats:e.target.value})} required />
              <input type="number" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600" placeholder="Price" value={carForm.price} onChange={e=>setCarForm({...carForm, price:e.target.value})} required />
            </div>
            <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600" value={carForm.currency} onChange={e=>setCarForm({...carForm, currency:e.target.value})}>
              <option value="ETB">ETB</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
            <input type="file" accept="image/*" multiple className="block w-full rounded-md border border-dashed border-gray-300 p-2 text-sm text-gray-600" onChange={e=>setCarForm({...carForm, images:e.target.files})} required />
            <button className="inline-flex items-center rounded-md bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-emerald-500 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2">Create</button>
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
            setShowCreateHouse(true);
            setHouseForm({
              ...houseForm,
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
              sizeStandard: item.sizeStandard,
              images: []
            });
            // attach id for update
            setPendingAction('edit-house-' + item._id);
          } else {
            setShowCreateCar(true);
            setCarForm({
              ...carForm,
              make: item.make,
              model: item.model,
              year: item.year,
              mileage: item.mileage || '',
              fuelType: item.fuelType,
              transmission: item.transmission,
              seats: item.seats,
              price: item.price,
              currency: item.currency,
              images: []
            });
            setPendingAction('edit-car-' + item._id);
          }
        }}
        onDelete={async (item, type) => {
          try {
            if (type === 'house') await API.delete(`/houses/${item._id}`);
            else await API.delete(`/cars/${item._id}`);
            toast.success('Listing deleted');
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
            toast.success(item.hidden ? 'Listing unhidden' : 'Listing hidden');
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
