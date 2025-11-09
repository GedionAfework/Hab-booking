import React, { useState } from "react";
import { toast } from "react-toastify";
import API from "../services";
import { Form, FormField, Input, Button, Card, CardHeader, CardContent, CardTitle } from "../components/ui";

export default function Login({ onAuth }) {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      onAuth(res.data);
    } catch (err) {
      toast(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Email">
              <Input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </FormField>
            <FormField label="Password">
              <Input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
            </FormField>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
