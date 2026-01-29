# Smart Shopping Cart
A smart shopping cart system with barcode scanning camera scanning , real-time calculations, budget tracking, and AI recommendations

###  Sprint 1-6: Core Features Delivered
- **Sprint 1:** UI Foundation - Scan interface, reusable components, responsive design
- **Sprint 2:** Core Scanning - Barcode scanning, product lookup, error handling
- **Sprint 3:** Camera Integration - Camera-based scanning, enhanced UX
- **Sprint 4:** Real-time Calculations - Live bill updates, dynamic pricing
- **Sprint 5:** Budget Management - Budget tracking, exceed alerts
- **Sprint 6:** AI Features - Smart recommendations, personalized suggestions

### **Sprint 7+: Upcoming Features**
- Low-stock alerts for managers (Sprint 7)
- Automatic inventory updates (Sprint 8)
- Supplier notifications (Sprint 9)
- Stock dashboard (Sprint 10)

## Tech Stack

**Frontend:** React.js, HTML5, CSS3  
**Backend:** ASP.NET Core, C#  
**Database:** SQL Server / MySQL

## Setup

### Prerequisites
- Node.js (v16+)
- .NET SDK (v6.0+)
- SQL Server or MySQL

### Installation

```bash
# Clone repository
git clone https://github.com/haiqakhan1/smartshoppingcart.git
cd smartshoppingcart

# Frontend setup
cd frontend
npm install
npm start
# Runs on http://localhost:5173

# Backend setup (new terminal)
cd backend
dotnet restore
dotnet run
# Runs on http://localhost:7005
```

### Database Setup

Create database and run migration scripts from `/database/migrations` folder.

Create `.env` file in backend directory:
```env
DATABASE_CONNECTION_STRING=your_connection_string
API_PORT=7005
```

## Testing

```bash
# Frontend
cd frontend && npm test

# Backend
cd backend && dotnet test
```
