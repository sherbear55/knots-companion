// Server component — forces dynamic rendering so query params are available
export const dynamic = 'force-dynamic';

import { SuccessContent } from './success-content';

export default function CheckoutSuccessPage() {
  return <SuccessContent />;
}
