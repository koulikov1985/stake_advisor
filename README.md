# Subscription License Key System

A complete subscription-based license key system with React frontend, Node.js backend, PostgreSQL database, and Stripe payment integration.

## Pricing Structure

- **Daily**: $4.99/day
- **Weekly**: $19.99/week
- **Monthly**: $79.99/month

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  React Frontend │────▶│  Express API    │────▶│   PostgreSQL    │
│  (Purchase Site)│     │  (Backend)      │     │   (Database)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │
        │                       │
        ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│     Stripe      │     │  Your Software  │
│   (Payments)    │     │  (Verification) │
└─────────────────┘     └─────────────────┘
```

## Project Structure

```
/server/
├── backend/
│   ├── index.js              # Main Express server
│   ├── routes/
│   │   ├── auth.js           # License routes
│   │   ├── payment.js        # Stripe routes
│   │   └── verify.js         # Software verification
│   ├── db/
│   │   ├── pool.js           # Database connection
│   │   └── schema.sql        # Database schema
│   ├── middleware/
│   │   └── rateLimit.js      # Rate limiting
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.jsx
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── PricingCard.jsx
│   │   │   └── LicenseDisplay.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   └── Success.jsx
│   │   └── styles/
│   │       └── index.css
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Setup Instructions

### 1. Database Setup

Create a PostgreSQL database and run the schema:

```bash
createdb license_keys
psql -d license_keys -f backend/db/schema.sql
```

### 2. Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Go to the Stripe Dashboard
3. Create three products with one-time prices:
   - Daily Plan: $4.99
   - Weekly Plan: $19.99
   - Monthly Plan: $79.99
4. Copy the Price IDs for each plan
5. Get your API keys from Developers > API keys
6. Set up a webhook endpoint (Developers > Webhooks):
   - Endpoint URL: `https://your-domain.com/api/webhook`
   - Events: `checkout.session.completed`
   - Copy the webhook signing secret

### 3. Backend Setup

```bash
cd backend

# Copy environment file and configure
cp .env.example .env

# Edit .env with your values:
# - DATABASE_URL
# - STRIPE_SECRET_KEY
# - STRIPE_WEBHOOK_SECRET
# - STRIPE_PRICE_DAILY, STRIPE_PRICE_WEEKLY, STRIPE_PRICE_MONTHLY

# Install dependencies
npm install

# Start server
npm start

# Or for development with auto-reload
npm run dev
```

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at http://localhost:5173

### 5. Local Development with Webhooks

For local development, use [Stripe CLI](https://stripe.com/docs/stripe-cli) to forward webhooks:

```bash
# Install Stripe CLI, then:
stripe login
stripe listen --forward-to localhost:3000/api/webhook

# Copy the webhook signing secret and add to .env
```

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/health` | Health check |
| POST | `/api/create-checkout-session` | Start Stripe checkout |
| POST | `/api/webhook` | Stripe webhook handler |
| GET | `/api/session/:sessionId` | Get license after payment |
| POST | `/api/verify` | Software license verification |
| GET | `/api/license/:email` | Retrieve license by email |
| POST | `/api/check-email` | Check if email has license |

## Software Integration

Your software should call the verification endpoint to validate licenses:

```bash
POST https://your-server.com/api/verify
Content-Type: application/json

{
  "license_key": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

Response:
```json
{
  "valid": true,
  "plan": "monthly",
  "expires_at": "2024-02-15T00:00:00.000Z",
  "days_remaining": 28
}
```

### Example Integration (Node.js)

```javascript
async function verifyLicense(licenseKey) {
  const response = await fetch('https://your-server.com/api/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ license_key: licenseKey })
  });

  const data = await response.json();
  return data.valid;
}
```

## Environment Variables

### Backend (.env)

```
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/license_keys
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_DAILY=price_xxx
STRIPE_PRICE_WEEKLY=price_xxx
STRIPE_PRICE_MONTHLY=price_xxx
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:3000
```

## Testing the Flow

1. Visit the frontend at http://localhost:5173
2. Select a plan and click "Get Started"
3. Use Stripe test card: `4242 4242 4242 4242`
4. After payment, you'll see your license key
5. Test verification:

```bash
curl -X POST http://localhost:3000/api/verify \
  -H "Content-Type: application/json" \
  -d '{"license_key": "your-license-key-here"}'
```

## Production Deployment

1. Use a production PostgreSQL database
2. Switch to Stripe live keys
3. Set `NODE_ENV=production`
4. Use HTTPS for all endpoints
5. Set up proper webhook endpoint URL in Stripe Dashboard
6. Configure CORS for your production domain
7. Consider adding email notifications for license delivery

## License

MIT
