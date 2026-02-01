# 🔧 Server & Client Configuration Guide

## 📋 Overview
This guide explains how to properly configure both the **client (frontend)** and **server (backend)** for your e-commerce admin panel.

---

## 🖥️ CLIENT CONFIGURATION (Frontend - React/Vite)

### 1. Environment Variables

Create `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=https://z71mwq0q-8000.inc1.devtunnels.ms

# Application Configuration
VITE_APP_NAME=eacyclic
VITE_APP_URL=http://localhost:5173
```

### 2. API Configuration

The API utility (`src/utils/api.js`) is already configured to use environment variables:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://z71mwq0q-8000.inc1.devtunnels.ms';
```

### 3. Routing Configuration

#### For Vercel Deployment:
`vercel.json` (already configured):
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### For Netlify Deployment:
`public/_redirects` (already configured):
```
/* /index.html 200
```

### 4. Development Server

Start the development server:
```bash
npm run dev
```

Access at: `http://localhost:5173`

### 5. Production Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

---

## 🔌 SERVER CONFIGURATION (Backend - FastAPI/Python)

### 1. CORS Configuration

Your backend **MUST** have CORS enabled to allow requests from the frontend.

#### FastAPI Example:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Development
        "http://localhost:4173",  # Preview
        "https://your-domain.com",  # Production
        "https://z71mwq0q-8000.inc1.devtunnels.ms"  # Dev tunnel
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)
```

### 2. Required API Endpoints

Your backend should implement these endpoints:

#### Products API
```python
@app.get("/products")
async def get_products():
    # Return list of products
    return {"data": [...]}

@app.get("/products/{id}")
async def get_product(id: int):
    # Return single product
    return {"data": {...}}

@app.post("/products")
async def create_product(product: Product):
    # Create new product
    return {"data": {...}}

@app.put("/products/{id}")
async def update_product(id: int, product: Product):
    # Update product
    return {"data": {...}}

@app.delete("/products/{id}")
async def delete_product(id: int):
    # Delete product
    return {"message": "Product deleted"}
```

#### Orders API
```python
@app.get("/orders")
async def get_orders():
    return {"data": [...]}

@app.get("/orders/{id}")
async def get_order(id: int):
    return {"data": {...}}

@app.patch("/orders/{id}/status")
async def update_order_status(id: int, status: str):
    return {"data": {...}}
```

#### Contacts API
```python
@app.get("/contacts")
async def get_contacts():
    return {"data": [...]}

@app.patch("/contacts/{id}/read")
async def mark_contact_read(id: int):
    return {"data": {...}}

@app.delete("/contacts/{id}")
async def delete_contact(id: int):
    return {"message": "Contact deleted"}
```

#### Deliveries API
```python
@app.get("/deliveries")
async def get_deliveries():
    return {"data": [...]}

@app.patch("/deliveries/{id}/status")
async def update_delivery_status(id: int, status: str):
    return {"data": {...}}
```

#### Analytics API
```python
@app.get("/analytics/dashboard")
async def get_dashboard_stats():
    return {
        "data": {
            "total_products": 100,
            "total_orders": 500,
            "total_revenue": 50000.00
        }
    }

@app.get("/analytics/daily")
async def get_daily_stats():
    return {"data": [...]}

@app.get("/analytics/monthly")
async def get_monthly_stats():
    return {"data": [...]}

@app.get("/analytics/yearly")
async def get_yearly_stats():
    return {"data": [...]}
```

### 3. Response Format

All API responses should follow this format:

#### Success Response:
```json
{
  "data": {
    "id": 1,
    "name": "Product Name",
    "price": 99.99
  },
  "status": "success"
}
```

#### Error Response:
```json
{
  "error": "Error message",
  "status": "error",
  "code": 400
}
```

### 4. Data Models

#### Product Model:
```json
{
  "id": 1,
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "category": "Electronics",
  "stock": 50,
  "image_url": "https://example.com/image.jpg",
  "discount": 10,
  "created_at": "2026-01-31T00:00:00Z"
}
```

#### Order Model:
```json
{
  "id": 1,
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "+1234567890",
  "shipping_address": "123 Main St, City, Country",
  "status": "pending",
  "total": 199.99,
  "subtotal": 179.99,
  "shipping_cost": 10.00,
  "tax": 10.00,
  "items": [
    {
      "product_id": 1,
      "product_name": "Product Name",
      "quantity": 2,
      "price": 89.99
    }
  ],
  "created_at": "2026-01-31T00:00:00Z"
}
```

#### Contact Model:
```json
{
  "id": 1,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "subject": "Product Inquiry",
  "message": "I have a question about...",
  "is_read": false,
  "created_at": "2026-01-31T00:00:00Z"
}
```

#### Delivery Model:
```json
{
  "id": 1,
  "order_id": 1,
  "tracking_number": "TRK123456",
  "customer_name": "John Doe",
  "shipping_address": "123 Main St",
  "status": "in_transit",
  "estimated_delivery": "2026-02-05",
  "created_at": "2026-01-31T00:00:00Z"
}
```

### 5. Status Values

#### Order Status:
- `pending`
- `processing`
- `shipped`
- `delivered`
- `cancelled`

#### Delivery Status:
- `pending`
- `in_transit`
- `out_for_delivery`
- `delivered`
- `failed`

---

## 🔐 Security Configuration

### 1. Environment Variables (Server)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost/dbname

# CORS
ALLOWED_ORIGINS=http://localhost:5173,https://your-domain.com

# API Keys (if needed)
API_SECRET_KEY=your-secret-key
```

### 2. Rate Limiting (Recommended)

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.get("/api/products")
@limiter.limit("100/minute")
async def get_products(request: Request):
    return {"data": [...]}
```

### 3. Authentication (Optional)

If you want to add API authentication:

```python
from fastapi import Header, HTTPException

async def verify_token(authorization: str = Header(None)):
    if not authorization or authorization != "Bearer your-secret-token":
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True

@app.get("/products", dependencies=[Depends(verify_token)])
async def get_products():
    return {"data": [...]}
```

Then update client API:

```javascript
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-secret-token'
  },
});
```

---

## 🚀 Deployment Configuration

### Client (Frontend)

#### Vercel:
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

#### Netlify:
1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables

### Server (Backend)

#### Railway:
```bash
railway login
railway init
railway up
```

#### Heroku:
```bash
heroku create your-app-name
git push heroku main
```

#### DigitalOcean:
Use App Platform or deploy to a Droplet with Docker

---

## 🧪 Testing the Connection

### 1. Test API Endpoint

```bash
curl https://z71mwq0q-8000.inc1.devtunnels.ms/products
```

### 2. Test CORS

```javascript
fetch('https://z71mwq0q-8000.inc1.devtunnels.ms/products')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error('CORS Error:', err));
```

### 3. Check Network Tab

Open browser DevTools → Network tab → Check:
- Request URL
- Request Method
- Status Code
- Response Headers (especially CORS headers)

---

## 🐛 Troubleshooting

### CORS Errors

**Error**: "Access to fetch has been blocked by CORS policy"

**Solution**:
1. Add your frontend URL to backend CORS allowed origins
2. Ensure backend is sending proper CORS headers
3. Check if credentials are needed

### API Connection Errors

**Error**: "Network Error" or "Failed to fetch"

**Solution**:
1. Verify backend server is running
2. Check API URL is correct
3. Test endpoint with curl or Postman
4. Check firewall/network settings

### 404 Errors on Refresh

**Error**: Page not found when refreshing admin routes

**Solution**:
1. Ensure `vercel.json` or `_redirects` is configured
2. Server must redirect all routes to `index.html`
3. Check deployment platform routing settings

---

## ✅ Checklist

### Client Setup:
- [ ] `.env` file created with API URL
- [ ] Dependencies installed (`npm install`)
- [ ] Development server running (`npm run dev`)
- [ ] Can access admin login at `/admin/login`
- [ ] Routes working correctly

### Server Setup:
- [ ] CORS middleware configured
- [ ] All required endpoints implemented
- [ ] Proper response format
- [ ] Error handling in place
- [ ] Server running and accessible

### Integration:
- [ ] Client can connect to server
- [ ] API calls working
- [ ] Data displaying correctly
- [ ] CRUD operations functional
- [ ] No CORS errors

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check network tab for failed requests
3. Verify API endpoint URLs
4. Test API with Postman/curl
5. Check server logs

---

**Your admin panel is now properly configured for both client and server!** 🎉
