# Admin Panel Documentation

## Overview
This is a comprehensive admin panel for the eacyclic e-commerce platform with advanced features including product management, order tracking, delivery management, contact form submissions, and detailed analytics.

## Admin Credentials
- **Username:** `admin_nisam`
- **Password:** `Nizam@5001#`

## Features

### 1. Dashboard (`/admin/dashboard`)
- **Real-time Statistics:**
  - Total Products
  - Total Orders
  - Pending Deliveries
  - Unread Messages
  
- **Sales Analytics:**
  - Today's Sales
  - Monthly Sales
  - Yearly Sales
  - Total Revenue

- **Interactive Charts:**
  - Sales Overview (Line Chart) - View by Day/Month/Year
  - Order Status Distribution (Pie Chart)
  
- **Recent Orders Table:**
  - Quick view of latest orders
  - Status indicators
  - Customer information

### 2. Product Management (`/admin/products`)
- Add new products
- Edit existing products
- Delete products
- Search products by name or category
- Product fields:
  - Name
  - Description
  - Price
  - Stock quantity
  - Category
  - Discount percentage
  - Image URL

### 3. Order Management (`/admin/orders`)
- View all orders
- Filter by status (pending, processing, shipped, delivered, cancelled)
- Search by order ID, customer name, or email
- View detailed order information
- Update order status
- Order details include:
  - Customer information
  - Order items
  - Pricing breakdown
  - Shipping address

### 4. Delivery Management (`/admin/delivery`)
- Track all deliveries
- Filter by delivery status
- Update delivery status:
  - Pending
  - In Transit
  - Out for Delivery
  - Delivered
  - Failed
- View tracking numbers
- Estimated delivery dates
- Customer shipping addresses

### 5. Contact Messages (`/admin/contacts`)
- View all contact form submissions
- Mark messages as read/unread
- Filter by read status
- Delete messages
- View detailed message information including:
  - Customer name
  - Email
  - Phone number
  - Subject
  - Message content
  - Timestamp

## API Integration

The admin panel integrates with the backend API at:
```
https://z71mwq0q-8000.inc1.devtunnels.ms
```

### API Endpoints Used:

#### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create new product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

#### Orders
- `GET /orders` - Get all orders
- `GET /orders/:id` - Get order by ID
- `POST /orders` - Create new order
- `PUT /orders/:id` - Update order
- `PATCH /orders/:id/status` - Update order status
- `DELETE /orders/:id` - Delete order

#### Contacts
- `GET /contacts` - Get all contact messages
- `GET /contacts/:id` - Get contact by ID
- `PATCH /contacts/:id/read` - Mark as read
- `DELETE /contacts/:id` - Delete contact

#### Deliveries
- `GET /deliveries` - Get all deliveries
- `GET /deliveries/:id` - Get delivery by ID
- `PUT /deliveries/:id` - Update delivery
- `PATCH /deliveries/:id/status` - Update delivery status

#### Analytics
- `GET /analytics/daily` - Get daily statistics
- `GET /analytics/monthly` - Get monthly statistics
- `GET /analytics/yearly` - Get yearly statistics
- `GET /analytics/sales/:period` - Get sales report
- `GET /analytics/dashboard` - Get dashboard stats

## Technical Stack

### Frontend
- **React** - UI framework
- **React Router** - Routing
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **React Icons** - Icon library
- **Tailwind CSS** - Styling

### Key Components
- `AdminContext.jsx` - Authentication context
- `ProtectedRoute.jsx` - Route protection
- `api.js` - API utility functions

## Security Features

1. **Authentication:**
   - Login required for all admin routes
   - Session persistence using localStorage
   - Protected routes with authentication checks

2. **Route Protection:**
   - Automatic redirect to login for unauthenticated users
   - Separate admin routes without public header/footer

## Sales Reports & Analytics

### Period-based Reports:
- **Daily:** Last 24 hours (hourly breakdown)
- **Monthly:** Last 30 days (daily breakdown)
- **Yearly:** Last 12 months (monthly breakdown)

### Metrics Tracked:
- Sales revenue
- Order count
- Order status distribution
- Product inventory
- Delivery status
- Customer inquiries

## User Experience Features

### Design:
- Modern glassmorphism UI
- Gradient backgrounds
- Smooth animations and transitions
- Responsive design for all screen sizes
- Intuitive navigation

### Interactions:
- Real-time search and filtering
- Modal-based forms
- Status badges with color coding
- Hover effects
- Loading states

## Getting Started

1. **Access the Admin Panel:**
   Navigate to `/admin/login`

2. **Login:**
   Use the credentials:
   - Username: `admin_nisam`
   - Password: `Nizam@5001#`

3. **Navigate:**
   - Dashboard: Overview and analytics
   - Products: Manage product catalog
   - Orders: Process and track orders
   - Delivery: Monitor deliveries
   - Contacts: Handle customer inquiries

## Best Practices

1. **Product Management:**
   - Keep product information up-to-date
   - Use high-quality image URLs
   - Set appropriate stock levels
   - Apply discounts strategically

2. **Order Processing:**
   - Update order status promptly
   - Review order details before status changes
   - Monitor pending deliveries

3. **Customer Service:**
   - Respond to contact messages quickly
   - Mark messages as read after handling
   - Keep customer information confidential

4. **Analytics:**
   - Review daily sales reports
   - Monitor trends across different periods
   - Use data to make informed decisions

## Troubleshooting

### Common Issues:

1. **Login Issues:**
   - Verify credentials are correct
   - Clear browser cache and localStorage
   - Check network connection

2. **API Errors:**
   - Ensure backend server is running
   - Check API endpoint URLs
   - Verify network connectivity

3. **Data Not Loading:**
   - Check browser console for errors
   - Verify API responses
   - Refresh the page

## Future Enhancements

Potential features for future updates:
- Email notifications for new orders
- Bulk product import/export
- Advanced filtering and sorting
- Customer management system
- Inventory alerts
- Multi-admin support with roles
- Activity logs
- Report exports (PDF/Excel)

## Support

For technical support or questions about the admin panel, please contact the development team.

---

**Version:** 1.0.0  
**Last Updated:** January 2026  
**Developer:** eacyclic Team
