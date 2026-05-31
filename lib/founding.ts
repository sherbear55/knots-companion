/** Founding member seat configuration.
 *  When Supabase is connected, replace FOUNDING_SEATS_TAKEN
 *  with a real-time query: SELECT COUNT(*) FROM subscriptions WHERE is_founding = true
 */
export const FOUNDING_SEAT_CAP    = 100;
export const FOUNDING_SEATS_TAKEN = 0;   // ← update manually or pull from DB
export const FOUNDING_SEATS_LEFT  = Math.max(0, FOUNDING_SEAT_CAP - FOUNDING_SEATS_TAKEN);

export const FOUNDING_PRICE_MONTHLY  = '6.99';
export const FOUNDING_PRICE_6MONTH   = '35.99';
export const FOUNDING_PRICE_12MONTH  = '64.99';
export const POST_FOUNDING_PRICE     = '9.99';
