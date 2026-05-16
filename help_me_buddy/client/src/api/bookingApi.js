import API from "./axios";

// Create a new booking
export const createBooking = (data) => {
  return API.post("/bookings", data);
};

// Get bookings for the logged-in user
export const getMyBookings = () => {
  return API.get("/bookings/my");
};
