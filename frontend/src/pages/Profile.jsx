import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API, { UPLOADS_BASE } from "../services";
import {
  IoMailOutline,
  IoLocationOutline,
  IoLockClosedOutline,
  IoHeartOutline,
} from "react-icons/io5";
import { Button } from "../components/ui";

const resolveAvatar = (src) => {
  if (!src) return null;
  return src.startsWith("/uploads") ? `${UPLOADS_BASE}${src}` : src;
};

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/me");
        setProfile(res.data);
        setForm((prev) => ({
          ...prev,
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          location: res.data.location || "",
          bio: res.data.bio || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
        setAvatarPreview(resolveAvatar(res.data.avatar));
      } catch (err) {
        toast(err.response?.data?.message || "Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    setAvatarFile(file || null);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      toast("New passwords do not match");
      return;
    }
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("phone", form.phone);
    fd.append("bio", form.bio);
    fd.append("location", form.location);
    if (form.currentPassword) fd.append("currentPassword", form.currentPassword);
    if (form.newPassword) fd.append("newPassword", form.newPassword);
    if (avatarFile) fd.append("avatar", avatarFile);

    try {
      setSaving(true);
      const res = await API.put("/auth/me", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile(res.data);
      setForm((prev) => ({
        ...prev,
        name: res.data.name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        location: res.data.location || "",
        bio: res.data.bio || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setAvatarFile(null);
      setAvatarPreview(resolveAvatar(res.data.avatar));

      const stored = localStorage.getItem("user");
      if (stored) {
        const updated = { ...JSON.parse(stored), name: res.data.name, avatar: res.data.avatar };
        localStorage.setItem("user", JSON.stringify(updated));
      }
      toast("Profile updated");
    } catch (err) {
      toast(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const initials = form.name
    .split(" ")
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("") || "U";

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-gray-100">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-slate-900">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-gray-300 bg-gray-200 text-2xl font-semibold text-gray-700 shadow dark:border-slate-700 dark:bg-slate-800 dark:text-gray-200">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="avatar" className="h-full w-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <label className="absolute bottom-0 right-0 inline-flex cursor-pointer items-center rounded-full bg-black px-2 py-1 text-xs font-medium text-white shadow dark:bg-white dark:text-black">
                  Change
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{form.name || "Your name"}</h1>
                <p className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <IoMailOutline />
                  {form.email}
                </p>
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                  Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "—"}
                </p>
              </div>
              <Button variant="outline" size="sm">Edit profile</Button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
          <div className="space-y-8">
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4 dark:border-gray-800 dark:bg-slate-900">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Personal information</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Full name
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100 dark:focus:border-gray-500 dark:focus:ring-gray-700"
                    required
                  />
                </label>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Phone
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100 dark:focus:border-gray-500 dark:focus:ring-gray-700"
                  />
                </label>
              </div>
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Bio
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100 dark:focus:border-gray-500 dark:focus:ring-gray-700"
                  placeholder="Tell hosts a little about yourself"
                />
              </label>
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Location
                <input
                  name="location"
                  value={form.location}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100 dark:focus:border-gray-500 dark:focus:ring-gray-700"
                  placeholder="Add your primary city"
                />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Email
                  <div className="mt-1 flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-500 dark:border-gray-700 dark:bg-slate-800 dark:text-gray-300">
                    <IoMailOutline />
                    {form.email}
                  </div>
                </label>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Address
                  <div className="mt-1 flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-300">
                    <IoLocationOutline />
                    {form.location || "Add your address"}
                  </div>
                </label>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white shadow hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4 dark:border-gray-800 dark:bg-slate-900">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Security</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Keep your account protected with a strong password.</p>
              <div className="grid gap-4 md:grid-cols-3">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Current password
                  <input
                    type="password"
                    name="currentPassword"
                    value={form.currentPassword}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100 dark:focus:border-gray-500 dark:focus:ring-gray-700"
                  />
                </label>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  New password
                  <input
                    type="password"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100 dark:focus:border-gray-500 dark:focus:ring-gray-700"
                  />
                </label>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Confirm password
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100 dark:focus:border-gray-500 dark:focus:ring-gray-700"
                  />
                </label>
              </div>
              <button className="inline-flex items-center gap-2 rounded-xl border border-gray-500 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-slate-800">
                <IoLockClosedOutline />
                Update password
              </button>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-slate-900">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage how you hear from us.</p>
              <div className="mt-4 space-y-4 text-sm text-gray-600 dark:text-gray-400">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                  Email confirmations
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4" />
                  Deal alerts & marketing
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                  App notifications
                </label>
              </div>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-slate-900">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                <IoHeartOutline /> Saved items
              </h3>
              <div className="mt-4 space-y-4 text-sm text-gray-600 dark:text-gray-300">
                {[
                  {
                    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=200&h=150&fit=crop",
                    title: "Paris Getaway",
                    type: "Flight",
                  },
                  {
                    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200&h=150&fit=crop",
                    title: "Beach Villa",
                    type: "House",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-center gap-3">
                    <img src={item.image} alt={item.title} className="h-16 w-20 rounded-lg object-cover" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-slate-900">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Quick stats</h3>
              <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>Total bookings</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">12</span>
                </div>
                <div className="flex justify-between">
                  <span>Countries visited</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">8</span>
                </div>
                <div className="flex justify-between">
                  <span>Loyalty points</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">2,450</span>
                </div>
              </div>
            </section>
          </aside>
        </form>
      </div>
    </div>
  );
};

export default Profile;
