import { toast as notify } from "react-toastify";

export const toast = ({ title, description, variant = "default" }) => {
  const message = description ? `${title ? `${title}: ` : ""}${description}` : title;
  if (variant === "destructive") return notify.error(message || "Something went wrong");
  if (variant === "success") return notify.success(message || "Success");
  return notify(message || "Notification");
};
