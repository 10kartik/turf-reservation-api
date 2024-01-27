### Guest User Endpoints:

#### View Available Slots

Endpoint: GET /api/bookings

Action: Retrieve a list of available time slots for a specific date or given date range.

#### Book a Slot:
Endpoint: POST /api/bookings

Action: Create a new booking for the selected time slot.

#### Confirm Payment:
Endpoint: PUT /api/bookings/{bookingId}/confirm-payment
Action: Confirm the payment for the booking.

### Admin User Endpoints:

#### View Pending Bookings:
Endpoint: GET /api/admin/bookings

Action: Retrieve the list of pending bookings.

#### Confirm Payment and Mark Booking as Booked:
Endpoint: PUT /api/admin/bookings/{bookingId}/confirm

Action: Confirm the payment and mark the booking as booked.