# Velora - Multi-Vendor Marketplace

Velora is a full-stack multi-vendor e-commerce marketplace built to model real marketplace workflows. It supports customer shopping, vendor product and order management, and administrator operations.

The platform includes role-based authorization, vendor-specific order separation, inventory validation, product snapshots, and transactional checkout.

## Features

### Customer

- Register and log in
- Browse and search marketplace products
- View product details
- Add products to the cart, update quantities, and remove products
- Enter shipping information and place orders
- View order history and individual order details

### Vendor

- View a vendor-specific dashboard
- Create products and manage inventory
- View vendor-specific orders and order details
- Update order status through the fulfillment workflow

Vendor routes use ownership checks where applicable so vendors cannot access another vendor's private resources.

### Administrator

- View marketplace operations
- Manage users, vendors, products, categories, and orders
- Review vendor approval requests

## Multi-Vendor Orders

A customer's cart may contain products from multiple vendors. Checkout creates one customer order and separate vendor orders containing only the items assigned to each vendor.

```text
Customer Cart
     |
  Checkout
     |
Customer Order
   /       \
Vendor A  Vendor B
Order      Order
```

This keeps the customer experience unified while vendors manage fulfillment for their own items.

## Transactional Checkout

Checkout validates cart contents and inventory, calculates totals, creates customer and vendor orders, and updates inventory within a MongoDB transaction. MongoDB transactions require a replica set; MongoDB Atlas provides this by default.

## Product Snapshots

Vendor orders store product details for the purchase-time record, including fields such as name, price, and brand when present. The order creation code also references image, SKU, category, and slug fields; fields not supplied by the product record may be absent from the snapshot.

## Authentication and Authorization

The backend uses JWT access tokens and role-based authorization for customers, vendors, and administrators. Login issues a short-lived access token and a refresh token. A refresh-token endpoint is not currently exposed by the backend.

Protected routes apply authentication and role checks before accessing customer, vendor, or administrator resources. Vendor resources also use ownership checks, for example:

```js
VendorOrder.findOne({
  _id: orderId,
  vendor: authenticatedVendorId,
});
```

## Architecture

```text
Next.js / React Component
          |
    Redux Toolkit
          |
       Service
          |
        Axios
          |
      Express API
          |
     Middleware
          |
      Controller
          |
     Mongoose Model
          |
       MongoDB
```

## Technology Stack

### Frontend

- Next.js and React
- TypeScript and Tailwind CSS
- Redux Toolkit
- React Hook Form and Zod
- Axios
- Lucide Icons and shadcn/ui components

### Backend

- Node.js and Express
- MongoDB and Mongoose
- JSON Web Tokens
- Joi request validation

### Security

- Helmet, CORS, rate limiting, and HTTP parameter pollution protection are configured
- Authentication, role authorization, ownership checks, and request validation protect API operations
- MongoDB sanitization and XSS middleware are present as dependencies but are currently disabled in `backend/src/middlewares/securityMiddleware.js`

### Testing and Deployment

- Jest and Supertest for backend tests
- Git and GitHub
- Postman or Thunder Client for API development
- Vercel for the frontend; Render or Railway for the backend
- MongoDB Atlas for hosted MongoDB

## Project Structure

```text
multivendor-marketplace/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── validators/
│   └── tests/
└── frontend/
    ├── public/
    └── src/
        ├── app/
        ├── components/
        ├── hooks/
        ├── lib/
        ├── services/
        ├── store/
        └── types/
```

## Environment Variables

Create local environment files and never commit real secrets.

### Frontend

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

In your frontend hosting settings, set `NEXT_PUBLIC_API_URL` to the deployed backend URL followed by `/api` (for example, `https://api.example.com/api`). This variable must be available when the frontend is built.

### Backend

Create `backend/.env`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
FRONTEND_URL=http://localhost:3000
```

In your backend hosting settings, set `FRONTEND_URL` to the deployed frontend origin (for example, `https://shop.example.com`). Separate multiple allowed frontend origins with commas. Set `NODE_ENV=production`; the backend host will normally provide `PORT` automatically. Keep real credentials in the hosting provider's environment settings, not in source control.

## Run Locally

Install dependencies in each application directory:

```bash
cd frontend
npm install

cd ../backend
npm install
```

Start the backend in one terminal:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Then open <http://localhost:3000>. The API runs on <http://localhost:5000> by default.

## Tests

Run the backend Jest suite from the backend directory:

```bash
cd backend
npm test
```

The suite covers authentication, product, cart, checkout, middleware, and error-handling behavior.

## Screenshots

Place screenshots in a `screenshots/` directory at this project root to use the following image references:

### Marketplace



## Design Philosophy

The storefront emphasizes discovery through expressive typography, deliberate spacing, and a considered visual hierarchy. Vendor and admin workspaces prioritize operational clarity and efficient management.

## Engineering Challenges

- Modeling multi-vendor orders and fulfillment
- Keeping customer orders and vendor orders correctly separated
- Preventing cross-vendor access to private resources
- Preserving purchase-time product details
- Validating inventory during checkout
- Coordinating database operations transactionally
- Synchronizing frontend state with backend APIs
- Supporting responsive customer, vendor, and admin workflows

## Future Improvements

- Payment gateway integration
- Product reviews and ratings
- Expanded vendor analytics and sales reporting
- Product recommendations and improved search
- Wishlist functionality
- Image upload and cloud storage
- Email order notifications and shipment tracking
- Additional automated and end-to-end tests
- PostgreSQL-based services where relational modeling provides advantages

## Author

**Nawab Zada**  
Full-Stack Developer

Core technologies: `Next.js` · `React` · `TypeScript` · `Node.js` · `Express.js` · `MongoDB` · `Redux Toolkit`

## Project Status

Core marketplace workflows are implemented, including customer cart and checkout, vendor product and order management, multi-vendor order processing, inventory handling, and marketplace administration. Backend automated tests are available through Jest.