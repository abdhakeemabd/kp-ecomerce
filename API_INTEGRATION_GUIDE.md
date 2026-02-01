# API Integration Quick Guide

## Current Setup

Your e-commerce application is configured to work with the API at:
```
https://z71mwq0q-8000.inc1.devtunnels.ms
```

## API Endpoints Expected

Based on standard e-commerce patterns, your backend should provide these endpoints:

### Products
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:id` - Get product by ID
- `POST /api/v1/products` - Create product (admin)
- `PUT /api/v1/products/:id` - Update product (admin)
- `DELETE /api/v1/products/:id` - Delete product (admin)

### Shopping Cart
- `GET /api/v1/cart` - Get user's cart
- `POST /api/v1/cart/add` - Add item to cart
  ```json
  {
    "product_id": "string",
    "quantity": 1
  }
  ```
- `PUT /api/v1/cart/:productId` - Update cart item quantity
  ```json
  {
    "quantity": 2
  }
  ```
- `DELETE /api/v1/cart/:productId` - Remove item from cart
- `DELETE /api/v1/cart/clear` - Clear entire cart

### User Profile
- `GET /api/v1/user/profile` - Get user profile
- `PUT /api/v1/user/profile` - Update user profile
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "age": 25,
    "gender": "male",
    "address": "123 Main St, City, Country"
  }
  ```

### Authentication
- `POST /api/v1/auth/login` - User login
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
  Response:
  ```json
  {
    "user": { "id": "...", "name": "...", "email": "..." },
    "token": "jwt_token_here"
  }
  ```

- `POST /api/v1/auth/register` - User registration
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890"
  }
  ```

- `POST /api/v1/auth/logout` - User logout

## Enabling API Integration

### Step 1: Verify API Endpoints
Check your API documentation at:
```
https://z71mwq0q-8000.inc1.devtunnels.ms/docs
```

### Step 2: Enable Cart API Sync

In `src/context/CartContext.jsx`, uncomment the API calls:

```javascript
// Add to cart
const result = await axios.post(`${API_BASE_URL}/api/v1/cart/add`, {
  product_id: product.id,
  quantity
});

// Remove from cart
await axios.delete(`${API_BASE_URL}/api/v1/cart/${productId}`);

// Update quantity
await axios.put(`${API_BASE_URL}/api/v1/cart/${productId}`, { quantity });

// Clear cart
await axios.delete(`${API_BASE_URL}/api/v1/cart/clear`);
```

### Step 3: Add Authentication Headers

Update the axios instance in `src/utils/api.js`:

```javascript
// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

### Step 4: Handle API Errors

Add response interceptor:

```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);
```

## Current Behavior (Offline Mode)

Currently, the app works **without a backend** using:
- **localStorage** for cart persistence
- **localStorage** for user profile
- **Mock data** for products

This allows you to:
- ✅ Test all features offline
- ✅ Develop without backend dependency
- ✅ Demo the application
- ✅ Ensure UI/UX is perfect

## Switching to API Mode

When your backend is ready:

1. **Uncomment API calls** in CartContext and UserContext
2. **Test authentication** flow
3. **Verify cart sync** works
4. **Test profile updates**
5. **Handle errors** gracefully

## Testing API Integration

### Test Cart API:
```bash
# Add to cart
curl -X POST https://z71mwq0q-8000.inc1.devtunnels.ms/api/v1/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"product_id": "1", "quantity": 1}'

# Get cart
curl -X GET https://z71mwq0q-8000.inc1.devtunnels.ms/api/v1/cart \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Profile API:
```bash
# Get profile
curl -X GET https://z71mwq0q-8000.inc1.devtunnels.ms/api/v1/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

# Update profile
curl -X PUT https://z71mwq0q-8000.inc1.devtunnels.ms/api/v1/user/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

## Environment Variables

Update `.env` if needed:
```env
VITE_API_BASE_URL=https://z71mwq0q-8000.inc1.devtunnels.ms
VITE_APP_NAME=eacyclic
VITE_APP_URL=http://localhost:5173
```

## CORS Configuration

Ensure your backend allows requests from:
```
http://localhost:5173
http://localhost:5174
```

Add CORS headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## Authentication Flow

1. User logs in via `/profile` or header menu
2. Backend returns JWT token
3. Token stored in localStorage
4. Token sent with every API request
5. Token validated on backend
6. User data synced across devices

## Error Handling

The app handles:
- ✅ Network errors
- ✅ Authentication errors (401)
- ✅ Server errors (500)
- ✅ Validation errors (400)
- ✅ Offline mode fallback

## Production Deployment

Before deploying:
1. ✅ Update API base URL in `.env`
2. ✅ Enable API sync in contexts
3. ✅ Test all endpoints
4. ✅ Configure CORS properly
5. ✅ Set up error monitoring
6. ✅ Enable HTTPS
7. ✅ Test authentication flow

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify API endpoints in Swagger docs
3. Test endpoints with curl/Postman
4. Check CORS configuration
5. Verify authentication tokens

---

**Note**: The app is currently in **offline mode** and will work perfectly without a backend. Enable API integration when your backend is ready!
