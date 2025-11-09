import { toast as notify } from "react-toastify";

export const toast = {
  success: (message) => notify.success(message),
  error: (message) => notify.error(message),
  info: (message) => notify.info(message),
  warning: (message) => notify.warn(message),
};
