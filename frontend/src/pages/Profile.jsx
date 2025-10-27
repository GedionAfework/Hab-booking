import React from "react";

const Profile = () => {
  const user = {
    name: "Gedion",
    email: "gedion@example.com",
    role: "user",
  };

  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl font-bold mb-3">Profile</h1>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
    </div>
  );
};

export default Profile;
