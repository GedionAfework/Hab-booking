import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import API from "../services";
import ModalDialog from "../components/ModalDialog";
import ConfirmDialog from "../components/ConfirmDialog";
import MyListings from "../components/MyListings";
import BookingCard from "../components/BookingCard";
import {
  IoAirplaneOutline,
  IoCarSportOutline,
  IoCheckmarkCircleOutline,
  IoHomeOutline,
  IoPeopleOutline,
  IoShieldCheckmarkOutline,
  IoTrashOutline,
  IoWarningOutline,
} from "react-icons/io5";
import {
  Button,
  Form,
  FormField,
  Input,
  Textarea,
  Select,
  Switch,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "../components/ui";

const defaultHouseForm = {
  name: "",
  type: "",
  description: "",
  price: "",
  currency: "ETB",
  bedroom: "",
  bathroom: "",
  kitchen: "",
  livingRoom: "",
  size: "",
  sizeStandard: "sqm",
  images: null,
};

const defaultCarForm = {
  make: "",
  model: "",
  year: "",
  mileage: "",
  fuelType: "",
  transmission: "",
  seats: "",
  price: "",
  currency: "ETB",
  images: null,
};

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user?.role === "admin";

  const [ownerBookings, setOwnerBookings] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [myHouses, setMyHouses] = useState([]);
  const [myCars, setMyCars] = useState([]);

  const [adminUsers, setAdminUsers] = useState([]);
  const [adminBookings, setAdminBookings] = useState([]);

  const [houseModalOpen, setHouseModalOpen] = useState(false);
  const [carModalOpen, setCarModalOpen] = useState(false);
  const [houseForm, setHouseForm] = useState(defaultHouseForm);
  const [carForm, setCarForm] = useState(defaultCarForm);
  const [editingHouseId, setEditingHouseId] = useState(null);
  const [editingCarId, setEditingCarId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [confirmState, setConfirmState] = useState({ open: false, message: "", onConfirm: null });

  const refreshData = async () => {
    try {
      const myBookingsPromise = API.get("/bookings/my/bookings");
      const ownerBookingsPromise = API.get("/bookings/owner/bookings").catch(() => ({ data: [] }));
      const housesPromise = API.get("/houses");
      const carsPromise = API.get("/cars");

      const [myBookingsRes, ownerBookingsRes, housesRes, carsRes] = await Promise.all([
        myBookingsPromise,
        ownerBookingsPromise,
        housesPromise,
        carsPromise,
      ]);

      setUserBookings(myBookingsRes.data || []);
      setOwnerBookings(ownerBookingsRes.data || []);

      const uid = user?._id;
      if (uid) {
        setMyHouses((housesRes.data || []).filter((h) => h.owner?._id === uid));
        setMyCars((carsRes.data || []).filter((c) => c.owner?._id === uid));
      } else {
        setMyHouses([]);
        setMyCars([]);
      }

      if (isAdmin) {
        try {
          const [usersRes, adminBookingsRes] = await Promise.all([
            API.get("/admin/users"),
            API.get("/admin/bookings"),
          ]);
          setAdminUsers(usersRes.data || []);
          setAdminBookings(adminBookingsRes.data || []);
        } catch (err) {
          console.error("Admin data error", err.response?.data || err.message);
          toast.error("Failed to load admin data");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load dashboard data");
    }
  };

  useEffect(() => {
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pendingApprovals = ownerBookings.filter((b) => b.status === "pending").length;
  const totalListings = myHouses.length + myCars.length;
  const upcomingTrips = userBookings.filter((b) => {
    if (!b.startDate) return false;
    try {
      return new Date(b.startDate) >= new Date();
    } catch {
      return false;
    }
  }).length;

  const stats = useMemo(
    () => [
      {
        label: "My bookings",
        value: userBookings.length,
        icon: IoAirplaneOutline,
        gradient: "from-blue-500 to-indigo-500",
      },
      {
        label: "Listings published",
        value: totalListings,
        icon: IoHomeOutline,
        gradient: "from-purple-500 to-pink-500",
      },
      {
        label: "Pending approvals",
        value: pendingApprovals,
        icon: IoShieldCheckmarkOutline,
        gradient: "from-amber-500 to-orange-500",
      },
      {
        label: isAdmin ? "Users managed" : "Upcoming trips",
        value: isAdmin ? adminUsers.length : upcomingTrips,
        icon: IoPeopleOutline,
        gradient: "from-emerald-500 to-teal-500",
      },
    ],
    [adminUsers.length, isAdmin, pendingApprovals, totalListings, upcomingTrips, userBookings.length]
  );

  const resetHouseForm = () => {
    setHouseForm(defaultHouseForm);
    setEditingHouseId(null);
  };

  const resetCarForm = () => {
    setCarForm(defaultCarForm);
    setEditingCarId(null);
  };

  const buildFormData = (dataObj) => {
    const fd = new FormData();
    Object.entries(dataObj).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      if (key === "images") {
        Array.from(value).forEach((file) => fd.append("images", file));
      } else {
        fd.append(key, value);
      }
    });
    return fd;
  };

  const handleSubmitHouse = async (e) => {
    e.preventDefault();
    const isEditing = Boolean(editingHouseId);
    const files = houseForm.images;
    if ((!isEditing || (files && files.length)) && (!files || files.length < 5)) {
      toast.error("Please upload at least 5 images for a house listing");
      return;
    }
    const payload = buildFormData(houseForm);
    try {
      setSubmitting(true);
      if (isEditing) {
        await API.put(`/houses/${editingHouseId}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("House updated");
      } else {
        await API.post("/houses", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("House listing created");
      }
      setHouseModalOpen(false);
      resetHouseForm();
      refreshData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save house");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitCar = async (e) => {
    e.preventDefault();
    const isEditing = Boolean(editingCarId);
    const files = carForm.images;
    if ((!isEditing || (files && files.length)) && (!files || files.length < 5)) {
      toast.error("Please upload at least 5 images for a car listing");
      return;
    }
    const payload = buildFormData(carForm);
    try {
      setSubmitting(true);
      if (isEditing) {
        await API.put(`/cars/${editingCarId}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Car updated");
      } else {
        await API.post("/cars", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Car listing created");
      }
      setCarModalOpen(false);
      resetCarForm();
      refreshData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save car");
    } finally {
      setSubmitting(false);
    }
  };

  const openHouseModal = (house = null) => {
    if (house) {
      setHouseForm({
        name: house.name || "",
        type: house.type || "",
        description: house.description || "",
        price: house.price || "",
        currency: house.currency || "ETB",
        bedroom: house.bedroom || "",
        bathroom: house.bathroom || "",
        kitchen: house.kitchen || "",
        livingRoom: house.livingRoom || "",
        size: house.size || "",
        sizeStandard: house.sizeStandard || "sqm",
        images: null,
      });
      setEditingHouseId(house._id);
    } else {
      resetHouseForm();
    }
    setHouseModalOpen(true);
  };

  const openCarModal = (car = null) => {
    if (car) {
      setCarForm({
        make: car.make || "",
        model: car.model || "",
        year: car.year || "",
        mileage: car.mileage || "",
        fuelType: car.fuelType || "",
        transmission: car.transmission || "",
        seats: car.seats || "",
        price: car.price || "",
        currency: car.currency || "ETB",
        images: null,
      });
      setEditingCarId(car._id);
    } else {
      resetCarForm();
    }
    setCarModalOpen(true);
  };

  const handleToggleListingVisibility = async (item, type) => {
    try {
      await API.put(`/${type === "house" ? "houses" : "cars"}/${item._id}`, {
        hidden: !item.hidden,
      });
      toast.success(item.hidden ? "Listing is now visible" : "Listing hidden");
      refreshData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to update visibility");
    }
  };

  const confirmAction = (message, action) => {
    setConfirmState({ open: true, message, onConfirm: action });
  };

  const handleDeleteListing = (item, type) => {
    confirmAction("Delete this listing permanently?", async () => {
      try {
        await API.delete(`/${type === "house" ? "houses" : "cars"}/${item._id}`);
        toast.success("Listing deleted");
        refreshData();
      } catch (err) {
        toast.error(err.response?.data?.message || "Delete failed");
      }
    });
  };

  const handleOwnerStatusChange = async (bookingId, status) => {
    try {
      await API.patch(`/bookings/owner/bookings/${bookingId}/status`, { status });
      toast.success(`Booking marked ${status}`);
      refreshData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleAdminRoleToggle = async (target) => {
    const nextRole = target.role === "admin" ? "user" : "admin";
    try {
      const res = await API.patch(`/admin/users/${target._id}/role`, { role: nextRole });
      toast.success(`Role changed to ${res.data.role}`);
      setAdminUsers((prev) => prev.map((u) => (u._id === res.data._id ? res.data : u)));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change role");
    }
  };

  const handleAdminDeleteUser = (target) => {
    confirmAction(`Delete ${target.name || target.email}?`, async () => {
      try {
        await API.delete(`/admin/users/${target._id}`);
        toast.success("User deleted");
        setAdminUsers((prev) => prev.filter((u) => u._id !== target._id));
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete user");
      }
    });
  };

  const handleAdminUpdateBooking = async (booking, status) => {
    try {
      await API.put(`/admin/bookings/${booking._id}`, { status });
      toast.success(`Booking ${status}`);
      refreshData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to update booking");
    }
  };

  const handleAdminDeleteBooking = (booking) => {
    confirmAction("Delete this booking record?", async () => {
      try {
        await API.delete(`/admin/bookings/${booking._id}`);
        toast.success("Booking removed");
        refreshData();
      } catch (err) {
        toast.error(err.response?.data?.message || "Delete failed");
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-12 space-y-10">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name || "traveler"}</h1>
          <p className="text-sm text-gray-500">
            Manage your listings, keep an eye on bookings, and oversee your travel business in one place.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="overflow-hidden rounded-3xl border border-white bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className={`inline-flex items-center justify-center rounded-2xl bg-gradient-to-r ${stat.gradient} px-3 py-2 text-white`}>
                  <Icon className="text-xl" />
                </div>
                <p className="mt-6 text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-3xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </section>

        <section className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => openHouseModal()}
            className="inline-flex items-center gap-2 border-blue-200 text-blue-600 hover:border-blue-500 hover:bg-blue-50"
          >
            <IoHomeOutline />
            New house listing
          </Button>
          <Button
            variant="outline"
            onClick={() => openCarModal()}
            className="inline-flex items-center gap-2 border-purple-200 text-purple-600 hover:border-purple-500 hover:bg-purple-50"
          >
            <IoCarSportOutline />
            New car listing
          </Button>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">My listings</h2>
          <MyListings
            houses={myHouses}
            cars={myCars}
            onEdit={(item, type) => (type === "house" ? openHouseModal(item) : openCarModal(item))}
            onDelete={handleDeleteListing}
            onToggleHide={handleToggleListingVisibility}
          />
        </section>

        {ownerBookings.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">Bookings awaiting approval</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {ownerBookings.map((booking) => (
                <div key={booking._id} className="rounded-2xl border border-white bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold uppercase tracking-wide text-blue-500">
                      {booking.listingType}
                    </div>
                    <span className="text-xs font-medium text-gray-500">{booking.status}</span>
                  </div>
                  <p className="mt-3 text-lg font-semibold text-gray-900">
                    {booking.user?.name || "Guest"}
                  </p>
                  <p className="text-sm text-gray-500">{booking.user?.email}</p>
                  <p className="mt-3 text-sm text-gray-600">
                    Total price: <span className="font-semibold text-gray-900">${booking.totalPrice}</span>
                  </p>
                  {booking.status === "pending" && (
                    <div className="mt-5 flex gap-2">
                      <button
                        onClick={() => handleOwnerStatusChange(booking._id, "confirmed")}
                        className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-400"
                      >
                        <IoCheckmarkCircleOutline />
                        Approve
                      </button>
                      <button
                        onClick={() => handleOwnerStatusChange(booking._id, "rejected")}
                        className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-rose-500 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-rose-400"
                      >
                        <IoWarningOutline />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">My bookings</h2>
            <a href="/bookings" className="text-sm font-semibold text-blue-600 hover:text-blue-500">
              View full history
            </a>
          </div>
          {userBookings.length === 0 ? (
            <div className="rounded-2xl border border-white bg-white p-12 text-center text-gray-500 shadow-sm">
              You have no bookings yet. Find your next stay on the home page.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {userBookings.slice(0, 4).map((booking) => (
                <BookingCard key={booking._id} booking={booking} />
              ))}
            </div>
          )}
        </section>

        {isAdmin && (
          <section className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">User management</h2>
              <div className="overflow-hidden rounded-2xl border border-white bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-100 text-sm">
                  <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {adminUsers.map((adminUser) => (
                      <tr key={adminUser._id} className="bg-white hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{adminUser.name}</td>
                        <td className="px-4 py-3 text-gray-600">{adminUser.email}</td>
                        <td className="px-4 py-3 text-gray-600">{adminUser.role}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleAdminRoleToggle(adminUser)}
                              className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:border-blue-500 hover:bg-blue-50"
                            >
                              Toggle role
                            </button>
                            <button
                              onClick={() => handleAdminDeleteUser(adminUser)}
                              className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:border-rose-400 hover:bg-rose-50"
                            >
                              <IoTrashOutline /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">All bookings</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {adminBookings.map((booking) => (
                  <div key={booking._id} className="rounded-2xl border border-white bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="font-semibold uppercase tracking-wide text-indigo-500">{booking.listingType}</span>
                      <span>{booking.status}</span>
                    </div>
                    <p className="mt-3 text-lg font-semibold text-gray-900">{booking.user?.name || "Guest"}</p>
                    <p className="text-sm text-gray-500">{booking.user?.email}</p>
                    <p className="mt-3 text-sm text-gray-600">
                      Total price: <span className="font-semibold text-gray-900">${booking.totalPrice}</span>
                    </p>
                    <div className="mt-5 flex gap-2">
                      <button
                        onClick={() => handleAdminUpdateBooking(booking, "confirmed")}
                        className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-600 transition hover:border-emerald-400 hover:bg-emerald-50"
                      >
                        <IoCheckmarkCircleOutline /> Confirm
                      </button>
                      <button
                        onClick={() => handleAdminUpdateBooking(booking, "cancelled")}
                        className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl border border-amber-200 px-3 py-2 text-sm font-semibold text-amber-600 transition hover:border-amber-400 hover:bg-amber-50"
                      >
                        <IoWarningOutline /> Cancel
                      </button>
                      <button
                        onClick={() => handleAdminDeleteBooking(booking)}
                        className="inline-flex items-center justify-center rounded-xl border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600 transition hover:border-rose-400 hover:bg-rose-50"
                      >
                        <IoTrashOutline />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* House modal */}
      <ModalDialog
        open={houseModalOpen}
        title={editingHouseId ? "Edit house listing" : "Create house listing"}
        onClose={() => {
          setHouseModalOpen(false);
          resetHouseForm();
        }}
      >
        <Form onSubmit={handleSubmitHouse} className="space-y-3 text-gray-900">
          <FormField label="Name">
            <Input
              value={houseForm.name}
              onChange={(e) => setHouseForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </FormField>
          <FormField label="Type">
            <Select
              value={houseForm.type}
              onChange={(e) => setHouseForm((prev) => ({ ...prev, type: e.target.value }))}
              required
            >
              <option value="">Select type</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="studio">Studio</option>
              <option value="villa">Villa</option>
            </Select>
          </FormField>
          <FormField label="Description">
            <Textarea
              rows={3}
              value={houseForm.description}
              onChange={(e) => setHouseForm((prev) => ({ ...prev, description: e.target.value }))}
              required
            />
          </FormField>
          <FormField label="Price">
            <Input
              type="number"
              value={houseForm.price}
              onChange={(e) => setHouseForm((prev) => ({ ...prev, price: e.target.value }))}
              required
            />
          </FormField>
          <div className="grid gap-2 md:grid-cols-2">
            <FormField label="Bedrooms">
              <Input
                type="number"
                value={houseForm.bedroom}
                onChange={(e) => setHouseForm((prev) => ({ ...prev, bedroom: e.target.value }))}
                required
              />
            </FormField>
            <FormField label="Bathrooms">
              <Input
                type="number"
                value={houseForm.bathroom}
                onChange={(e) => setHouseForm((prev) => ({ ...prev, bathroom: e.target.value }))}
                required
              />
            </FormField>
            <FormField label="Kitchens">
              <Input
                type="number"
                value={houseForm.kitchen}
                onChange={(e) => setHouseForm((prev) => ({ ...prev, kitchen: e.target.value }))}
                required
              />
            </FormField>
            <FormField label="Living rooms">
              <Input
                type="number"
                value={houseForm.livingRoom}
                onChange={(e) => setHouseForm((prev) => ({ ...prev, livingRoom: e.target.value }))}
                required
              />
            </FormField>
            <FormField label="Size">
              <Input
                type="number"
                value={houseForm.size}
                onChange={(e) => setHouseForm((prev) => ({ ...prev, size: e.target.value }))}
                required
              />
            </FormField>
            <FormField label="Size standard">
              <Select
                value={houseForm.sizeStandard}
                onChange={(e) => setHouseForm((prev) => ({ ...prev, sizeStandard: e.target.value }))}
              >
                <option value="sqm">sqm</option>
                <option value="sqft">sqft</option>
              </Select>
            </FormField>
            <FormField label="Currency">
              <Select
                value={houseForm.currency}
                onChange={(e) => setHouseForm((prev) => ({ ...prev, currency: e.target.value }))}
              >
                <option value="ETB">ETB</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </Select>
            </FormField>
          </div>
          <FormField label="Images">
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setHouseForm((prev) => ({ ...prev, images: e.target.files }))}
            />
          </FormField>
          <Button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500"
          >
            {submitting ? "Saving…" : editingHouseId ? "Update house" : "Create house"}
          </Button>
        </Form>
      </ModalDialog>

      {/* Car modal */}
      <ModalDialog
        open={carModalOpen}
        title={editingCarId ? "Edit car listing" : "Create car listing"}
        onClose={() => {
          setCarModalOpen(false);
          resetCarForm();
        }}
      >
        <Form onSubmit={handleSubmitCar} className="space-y-3 text-gray-900">
          <div className="grid gap-2 md:grid-cols-2">
            <FormField label="Make">
              <Input value={carForm.make} onChange={(e) => setCarForm((prev) => ({ ...prev, make: e.target.value }))} required />
            </FormField>
            <FormField label="Model">
              <Input value={carForm.model} onChange={(e) => setCarForm((prev) => ({ ...prev, model: e.target.value }))} required />
            </FormField>
            <FormField label="Year">
              <Input type="number" value={carForm.year} onChange={(e) => setCarForm((prev) => ({ ...prev, year: e.target.value }))} required />
            </FormField>
            <FormField label="Mileage (optional)">
              <Input type="number" value={carForm.mileage} onChange={(e) => setCarForm((prev) => ({ ...prev, mileage: e.target.value }))} />
            </FormField>
            <FormField label="Fuel type">
              <Select value={carForm.fuelType} onChange={(e) => setCarForm((prev) => ({ ...prev, fuelType: e.target.value }))} required>
                <option value="">Choose fuel</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </Select>
            </FormField>
            <FormField label="Transmission">
              <Select value={carForm.transmission} onChange={(e) => setCarForm((prev) => ({ ...prev, transmission: e.target.value }))} required>
                <option value="">Choose transmission</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </Select>
            </FormField>
            <FormField label="Seats">
              <Input type="number" value={carForm.seats} onChange={(e) => setCarForm((prev) => ({ ...prev, seats: e.target.value }))} required />
            </FormField>
            <FormField label="Price">
              <Input type="number" value={carForm.price} onChange={(e) => setCarForm((prev) => ({ ...prev, price: e.target.value }))} required />
            </FormField>
            <FormField label="Currency">
              <Select value={carForm.currency} onChange={(e) => setCarForm((prev) => ({ ...prev, currency: e.target.value }))}>
                <option value="ETB">ETB</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </Select>
            </FormField>
          </div>
          <FormField label="Images">
            <Input type="file" accept="image/*" multiple onChange={(e) => setCarForm((prev) => ({ ...prev, images: e.target.files }))} />
          </FormField>
          <Button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500"
          >
            {submitting ? "Saving…" : editingCarId ? "Update car" : "Create car"}
          </Button>
        </Form>
      </ModalDialog>

      <ConfirmDialog
        open={confirmState.open}
        text={confirmState.message}
        onCancel={() => setConfirmState({ open: false, message: "", onConfirm: null })}
        onConfirm={() => {
          confirmState.onConfirm?.();
          setConfirmState({ open: false, message: "", onConfirm: null });
        }}
      />
    </div>
  );
}
