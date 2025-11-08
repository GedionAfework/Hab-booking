import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API, { UPLOADS_BASE } from "../services";

const resolveAvatar = (src) => {
  if (!src) return null;
  return src.startsWith("/uploads") ? `${UPLOADS_BASE}${src}` : src;
};

export default function Profile() {
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
    <div className="space-y-10">
      <header className="rounded-3xl bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-500 p-8 text-white shadow-xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white/40 shadow-lg">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-semibold">
                  {initials}
                </div>
              )}
              <label className="absolute bottom-1 right-1 inline-flex cursor-pointer items-center rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-indigo-600 shadow">
                Change
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-white/70">Profile</p>
              <h1 className="text-3xl font-bold leading-tight">{form.name || "Your name"}</h1>
              <p className="text-sm text-white/80">{form.email}</p>
            </div>
          </div>
          <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm shadow">
            <p>Member since</p>
            <p className="text-lg font-semibold">
              {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "—"}
            </p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
        <section className="space-y-4 rounded-3xl border border-gray-200 bg-white/80 p-6 shadow">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Personal information</h2>
            <p className="text-sm text-gray-500">Update how you appear to hosts and guests.</p>
          </div>
          <label className="text-sm font-medium text-gray-700">
            Full name
            <input
              name="name"
              value={form.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600"
              required
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Email
            <input
              name="email"
              value={form.email}
              onChange={handleInputChange}
              className="mt-1 block w-full cursor-not-allowed rounded-lg border-gray-200 bg-gray-100 shadow-sm"
              disabled
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Bio
            <textarea
              name="bio"
              rows={4}
              value={form.bio}
              onChange={handleInputChange}
              placeholder="Tell guests what makes you unique..."
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600"
            />
          </label>
        </section>

        <section className="space-y-4 rounded-3xl border border-gray-200 bg-white/80 p-6 shadow">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Contact & location</h2>
            <p className="text-sm text-gray-500">Keep your details current so hosts can reach you.</p>
          </div>
          <label className="text-sm font-medium text-gray-700">
            Phone number
            <input
              name="phone"
              value={form.phone}
              onChange={handleInputChange}
              placeholder="+251..."
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600"
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Location
            <input
              name="location"
              value={form.location}
              onChange={handleInputChange}
              placeholder="Addis Ababa, Ethiopia"
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600"
            />
          </label>
        </section>

        <section className="space-y-4 rounded-3xl border border-gray-200 bg-white/80 p-6 shadow">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Security</h2>
            <p className="text-sm text-gray-500">Change your password to keep your account safe.</p>
          </div>
          <label className="text-sm font-medium text-gray-700">
            Current password
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600"
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            New password
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600"
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Confirm new password
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600"
            />
          </label>
          <p className="text-xs text-gray-400">
            Leave password fields blank to keep your current password.
          </p>
        </section>

        <div className="lg:col-span-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:from-violet-500 hover:via-indigo-500 hover:to-sky-400 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save profile changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
