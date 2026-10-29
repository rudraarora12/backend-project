import { INTERVIEWERS_DATA } from '../data/interviewers';

const STORAGE_KEY_BOOKINGS = 'ii_bookings';

export function getAllMentors() {
  return INTERVIEWERS_DATA;
}

export function getBookings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_BOOKINGS);
    if (stored) {
      const bookings = JSON.parse(stored);
      if (!Array.isArray(bookings)) throw new TypeError('Stored bookings must be an array.');
      return bookings.map((booking) => ({ ...booking, isDemo: true, status: 'Demo' }));
    }
    return [];
  } catch (err) {
    console.error('Error fetching bookings:', err);
    return [];
  }
}
