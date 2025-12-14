# Smart Shopping Cart

A smart shopping cart system that enables customers to scan items using barcode/RFID, view real-time totals, and receive AI-powered recommendations while helping retailers manage inventory efficiently.

## Features (Sprint 1)

- Barcode/RFID scanning functionality
- Product detail retrieval from database
- Invalid barcode error handling
- Basic cart management

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