import API from "./axios";

// Create a new booking
export const createBooking = (data) => {
  return API.post("/bookings", data);
};

// Get bookings for the logged-in user
export const getMyBookings = () => {
  return API.get("/bookings/my");
};

// Get bookings for the logged-in provider
export const getProviderBookings = () => {
  return API.get("/bookings/provider");
};

// Update booking status by provider
export const updateBookingStatus = (bookingId, status) => {
  return API.patch(`/bookings/${bookingId}/status`, { status });
};
