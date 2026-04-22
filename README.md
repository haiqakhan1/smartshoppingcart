# Smart Shopping Cart

> A smart shopping cart system featuring barcode scanning, camera scanning, real-time calculations, budget tracking, AI recommendations, a full Admin Dashboard, stock monitoring, alert system, and cloud deployment on Vercel and Azure.

---


## Live Deployment

| Environment | URL |
|-------------|-----|
| **Frontend (Production)** | [smartshoppingcart.vercel.app](https://smartshoppingcart.vercel.app) |
| **Admin Dashboard** | [smartshoppingcart.vercel.app/admin](https://smartshoppingcart.vercel.app/admin) |
| **Backend API** | [smartshop-api-...azurewebsites.net](https://smartshop-api-c3g4gefbbrakcwhs.centralindia-01.azurewebsites.net) |
| **Staging Preview** | [smartshoppingcart-git-main...vercel.app](https://smartshoppingcart-git-main-laibas-projects-b7c019c7.vercel.app) |

---

## Sprints Completed

### Sprint 1–6: Core Features

- **Sprint 1 :** Scan interface, reusable components, responsive design
- **Sprint 2 :** Barcode scanning, product lookup, error handling
- **Sprint 3 :** Camera-based scanning, enhanced UX
- **Sprint 4 :** Live bill updates, dynamic pricing
- **Sprint 5 :** Budget tracking, exceed alerts
- **Sprint 6 :** Smart recommendations, personalized suggestions

### Sprint 7–9: Admin and Inventory Features

- **Sprint 7 :** Stock monitoring, low-stock alerts for managers
- **Sprint 8 :** Real-time stock level adjustments
- **Sprint 9 :** Full inventory overview with visual analytics

---

## Tech Stack

- **Frontend:** React.js, HTML5, CSS3
- **Backend:** ASP.NET Core 8.0, C#
- **Database:** Azure SQL Server (SmartCheckout)
- **ORM:** Entity Framework Core
- **Hosting:** Vercel (Frontend), Microsoft Azure (Backend and Database)
- **CI/CD:** GitHub Actions

---

## Cloud Deployment

### Frontend — Vercel

Connected directly to the GitHub repository. Every push to `main` automatically triggers a fresh production deployment. No manual steps needed.

### Backend — Azure App Service

The ASP.NET Core 8.0 API runs on Azure in the **Central India** region. It stays live and handles all API requests from the frontend.

### Database — Azure SQL Server

- **Server:** `smartshop-server2.database.windows.net`
- **Database:** `SmartCheckout`
- All credentials are stored as environment variables and never exposed in the code.

---

## CI/CD Pipeline

Every push to `main` triggers the GitHub Actions pipeline automatically. The backend job runs first and the frontend job runs only after the backend build and tests pass successfully.

```yaml
name: SmartShoppingCart CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  backend:
    name: Backend Build and Test
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v3
        with:
          dotnet-version: '8.0.x'
      - run: dotnet restore
        working-directory: ./SmartShop
      - run: dotnet build --no-restore
        working-directory: ./SmartShop
      - run: dotnet test --no-build --verbosity normal
        working-directory: ./SmartShop

  frontend:
    name: Frontend Build and Test
    runs-on: windows-latest
    needs: backend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install
        working-directory: ./SmartCart
      - run: npm run build
        working-directory: ./SmartCart
```

---

## Prerequisites

- Node.js v16 or higher
- .NET SDK v8.0 or higher
- Azure SQL Server access

---

## Local Setup

**1. Clone the repository**

```bash
git clone https://github.com/haiqakhan1/smartshoppingcart.git
cd smartshoppingcart
```

**2. Start the frontend**

```bash
cd SmartCart
npm install
npm start
# Runs on http://localhost:5173
```

**3. Start the backend** *(open a new terminal)*

```bash
cd SmartShop
dotnet restore
dotnet run
# Runs on http://localhost:7005
```

---

## Database Setup

This project uses **Entity Framework Core** for database migrations. Run the following commands to get started.

**Apply all pending migrations:**

```bash
cd SmartShop
dotnet ef database update
```

**Create a new migration after model changes:**

```bash
dotnet ef migrations add <MigrationName>
```

**Add your connection string in `appsettings.json`:**

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=tcp:[HIDDEN];Initial Catalog=SmartCheckout;User ID=[HIDDEN];Password=[HIDDEN];Encrypt=True;"
}
```

> **Note:** Never commit real credentials. Always use environment variables for sensitive values.

---

## Testing

**Frontend tests**

```bash
cd SmartCart && npm test
```

**Backend tests**

```bash
cd SmartShop && dotnet test
```

---

## Repository

[github.com/haiqakhan1/smartshoppingcart](https://github.com/haiqakhan1/smartshoppingcart)
