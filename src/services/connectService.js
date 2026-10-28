import { INTERVIEWERS_DATA } from '../data/interviewers';

const STORAGE_KEY_BOOKINGS = 'ii_bookings';
const STORAGE_KEY_REVIEWS = 'ii_mentor_reviews';

export function getAllMentors() {
  return INTERVIEWERS_DATA;
}

export function getMentorById(id) {
  return INTERVIEWERS_DATA.find((m) => String(m.id) === String(id)) || null;
}

export function getBookings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_BOOKINGS);
    if (stored) {
      return JSON.parse(stored);
    }
    // Default sample booking
    const defaultBookings = [
      {
        id: 'II-AX2938',
        candidateId: 'cand-101',
        candidateName: 'Arjun Mehta',
        candidateAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        company: 'Amazon',
        role: 'SDE-1 (AWS CloudFront)',
        date: '2026-10-30',
        time: '7:00 PM IST',
        duration: '45 minutes',
        price: 499,
        status: 'Upcoming',
        createdAt: '2026-10-25T14:20:00Z'
      }
    ];
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(defaultBookings));
    return defaultBookings;
  } catch (err) {
    console.error('Error fetching bookings:', err);
    return [];
  }
}

export function createBooking({ mentor, date, time, notes }) {
  const bookings = getBookings();
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const bookingId = `II-${mentor.companySlug.substring(0, 2).toUpperCase()}${randomSuffix}`;

  const newBooking = {
    id: bookingId,
    candidateId: mentor.id,
    candidateName: mentor.name,
    candidateAvatar: mentor.avatar,
    company: mentor.company,
    role: mentor.role,
    date: date || new Date().toISOString().split('T')[0],
    time: time || '6:00 PM IST',
    duration: '45 minutes',
    price: mentor.hourlyRate,
    status: 'Upcoming',
    notes: notes || 'General interview preparation and mock coding session.',
    createdAt: new Date().toISOString()
  };

  const updated = [newBooking, ...bookings];
  localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(updated));
  return newBooking;
}

export function completeSessionReview(bookingId, reviewData) {
  try {
    const bookings = getBookings();
    const updatedBookings = bookings.map((b) => {
      if (b.id === bookingId) {
        return { ...b, status: 'Completed', debrief: reviewData };
      }
      return b;
    });
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(updatedBookings));

    // Also store review in mentor reviews
    const existingReviews = JSON.parse(localStorage.getItem(STORAGE_KEY_REVIEWS) || '[]');
    existingReviews.push({
      bookingId,
      ...reviewData,
      submittedAt: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(existingReviews));
    return true;
  } catch (err) {
    console.error('Error completing session review:', err);
    return false;
  }
}
