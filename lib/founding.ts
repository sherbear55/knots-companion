/** Founding member seat configuration.
 * FOUNDING_SEATS_LEFT is a static fallback only.
 * Live count is fetched from /api/founding-seats at runtime.
 */
export const FOUNDING_SEAT_CAP = 100;
export const FOUNDING_SEATS_TAKEN = 0; // static fallback — live count comes from DB
export const FOUNDING_SEATS_LEFT = Math.max(0, FOUNDING_SEAT_CAP - FOUNDING_SEATS_TAKEN);

export const FOUNDING_PRICE_MONTHLY = '6.99';
export const FOUNDING_PRICE_6MONTH = '35.99';
export const FOUNDING_PRICE_12MONTH = '64.99';
export const POST_FOUNDING_PRICE = '9.99';

/** Stripe Price IDs — LIVE mode.
 * Updated June 2026: switched from test mode (price_1TdF...) to live mode.
 */
export const STRIPE_PRICE_IDS: Record<string, string> = {
  monthly: 'price_1TkS9cRi2FjLoRi8qZ038PVO',
  '6month': 'price_1TkS9bRi2FjLoRi8XR0l6NYN',
  '12month': 'price_1TkS9XRi2FjLoRi82gTYb4ss',
};
