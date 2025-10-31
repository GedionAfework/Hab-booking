import React from "react";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Guest" };

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-4">My Profile</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email || "Not logged in"}</p>
    </div>
  );
}
