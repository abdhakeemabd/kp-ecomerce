# Quick Start Guide - Admin Panel

## 🚀 Getting Started

### 1. Access the Admin Panel
Open your browser and navigate to:
```
http://localhost:5173/admin/login
```

### 2. Login Credentials
```
Username: admin_nisam
Password: Nizam@5001#
```

### 3. Admin Panel Routes

| Route | Description |
|-------|-------------|
| `/admin/login` | Admin login page |
| `/admin/dashboard` | Main dashboard with analytics |
| `/admin/products` | Product management |
| `/admin/orders` | Order management |
| `/admin/delivery` | Delivery tracking |
| `/admin/contacts` | Contact form messages |

## 📊 Dashboard Features

### Statistics Cards
- **Total Products** - Count of all products in inventory
- **Total Orders** - All orders placed
- **Pending Deliveries** - Orders awaiting delivery
- **Unread Messages** - New contact form submissions

### Sales Summary
- **Today's Sales** - Revenue from today
- **This Month** - Current month revenue
- **This Year** - Year-to-date revenue

### Charts
1. **Sales Overview** - Line chart with day/month/year filters
2. **Order Status Distribution** - Pie chart showing order statuses
3. **Recent Orders** - Table of latest orders

## 🛍️ Product Management

### Add Product
1. Click "Add Product" button
2. Fill in the form:
   - Product Name
   - Description
   - Price
   - Stock quantity
   - Category
   - Discount (optional)
   - Image URL
3. Click "Add Product"

### Edit Product
1. Click "Edit" on any product card
2. Update the information
3. Click "Update Product"

### Delete Product
1. Click "Delete" on any product card
2. Confirm deletion

## 📦 Order Management

### View Orders
- All orders displayed in a table
- Filter by status: All, Pending, Processing, Shipped, Delivered, Cancelled
- Search by order ID, customer name, or email

### Update Order Status
1. Click "View" on an order
2. Click desired status button
3. Status updates automatically

## 🚚 Delivery Management

### Track Deliveries
- View all deliveries in card layout
- Filter by status
- Search by tracking number or customer

### Update Delivery Status
Available statuses:
- Pending
- In Transit
- Out for Delivery
- Delivered
- Failed

## 📧 Contact Messages

### Manage Messages
- View all contact form submissions
- Unread messages highlighted with blue border
- Filter: All, Unread, Read
- Search by name, email, or subject

### View Message Details
1. Click on any message
2. View full details
3. Message automatically marked as read

### Delete Messages
- Click trash icon on message
- Or open message and click "Delete Message"

## 🎨 Design Features

- **Modern UI** - Glassmorphism and gradients
- **Responsive** - Works on all screen sizes
- **Interactive Charts** - Powered by Recharts
- **Real-time Updates** - Data refreshes on actions
- **Smooth Animations** - Enhanced user experience

## 🔒 Security

- Protected routes require authentication
- Session persists in localStorage
- Automatic redirect to login if not authenticated
- Logout clears session

## 🛠️ Technical Details

### Dependencies Added
```json
{
  "recharts": "^2.x.x",
  "axios": "^1.x.x"
}
```

### API Configuration
Base URL: `https://z71mwq0q-8000.inc1.devtunnels.ms`

### File Structure
```
src/
├── context/
│   └── AdminContext.jsx
├── pages/
│   └── admin/
│       ├── AdminLogin.jsx
│       ├── AdminDashboard.jsx
│       ├── AdminProducts.jsx
│       ├── AdminOrders.jsx
│       ├── AdminDelivery.jsx
│       └── AdminContacts.jsx
├── component/
│   └── ProtectedRoute.jsx
└── utils/
    └── api.js
```

## 📱 Navigation

### From Dashboard
- **Products** - Manage product catalog
- **Orders** - View and process orders
- **Delivery** - Track deliveries
- **Messages** - Handle customer inquiries
- **Logout** - End session

### Back Navigation
All admin pages have a back arrow (←) to return to dashboard

## 💡 Tips

1. **Search is your friend** - Use search bars to quickly find items
2. **Filter for efficiency** - Use status filters to focus on specific items
3. **Check daily** - Review dashboard daily for insights
4. **Update promptly** - Keep order and delivery statuses current
5. **Respond quickly** - Check messages regularly

## 🐛 Troubleshooting

### Can't Login?
- Double-check credentials
- Clear browser cache
- Try incognito/private mode

### Data Not Loading?
- Check if backend API is running
- Check browser console for errors
- Verify network connection

### Charts Not Showing?
- Ensure there's data in the system
- Try different time periods
- Refresh the page

## 📞 Support

For issues or questions:
1. Check the full documentation in `ADMIN_PANEL_README.md`
2. Review browser console for errors
3. Contact development team

---

**Happy Managing! 🎉**
