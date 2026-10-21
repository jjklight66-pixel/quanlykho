# Northstar WMS

A runnable local WMS/OMS starter monorepo: PostgreSQL, Express API, React admin dashboard, and Expo warehouse app.

## Run the complete local stack

Requirements: Node.js 20+, npm 10+, and Docker Desktop running.

From this directory run (with Docker Desktop running):

```powershell
npm start
```

`start` installs workspace dependencies, starts PostgreSQL, applies the schema, seeds demo data, then starts the API, admin UI and Expo together. The admin UI is at http://localhost:5173, the API health endpoint is http://localhost:4000/api/health, and Expo prints a QR code for the phone app. The API uses local development secret fallbacks; set `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` in `.env` before any shared or deployed use.

On a physical phone set `EXPO_PUBLIC_API_URL` to the computer's LAN IP, for example `http://192.168.1.25:4000/api`; `localhost` on the phone points to the phone itself. The mobile start script detects the LAN IP automatically. Expo Go supports camera scanning on device. Android emulator can usually reach the host at `http://10.0.2.2:4000/api`.

## Demo accounts

All seeded accounts use password `WmsDemo!2026`:

| Role | Email |
|---|---|
| Admin | `admin@wms.local` |
| Warehouse operator | `warehouse@wms.local` |
| Shipper | `shipper@wms.local` |

The seed creates two warehouses, sixty products/SKUs, stock in both warehouses, and an example sales order (`SO-DEMO-001`). Seed can be rerun without duplicating catalog or stock.

## Workspace

```text
apps/
  api/       Express API, PostgreSQL schema, migration and seed
  web/       React/Vite admin app
  mobile/    Expo scanner, pick and delivery app
packages/   Reserved workspace for shared contracts and API client
infra/      Docker Compose PostgreSQL service
```

## Implemented flows

- JWT access tokens and rotating, hashed refresh-token records; role checks and per-warehouse authorization.
- Inventory search, FEFO order allocation under PostgreSQL row locks, idempotent reservation, picking/packing stock deduction, receipts, shipments, stocktake creation, user administration, and append-only stock transaction ledger.
- Admin overview, low-stock alerts, inventory search/export, sales orders, goods receiving, shipment operations, audit ledger and team access views.
- Mobile login with SecureStore, product barcode/QR camera scan, picking and shipment confirmation; offline action queue storage.

Remaining production additions include refresh-token reauthentication on mobile, user self-service account recovery/MFA, a complete stocktake user interface, GRN/PO line reconciliation, image upload storage for delivery evidence, socket-based live updates, robust offline replay with server idempotency, automated tests, observability, backups, and production secret management. The API includes stocktake create/count/approve endpoints; the web/mobile interface does not yet expose a complete stocktake flow. The current local mobile delivery proof fields accept metadata but do not upload an image.


## Project documentation

- [Project report (Vietnamese)](BAO_CAO_DU_AN.md)
- [Run and user guide (Vietnamese)](HUONG_DAN_SU_DUNG.md)
