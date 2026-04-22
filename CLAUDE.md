# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Two independent Node.js/Express microservices running on separate ports, managed from a shared root.

## Commands

### Install all dependencies
```bash
npm run install:all
```

### Run both services simultaneously (development)
```bash
npm run dev
```

### Run both services (production)
```bash
npm start
```

### Run a single service
```bash
# Users service (port 3001)
npm run dev --prefix services/users

# Products service (port 3002)
npm run dev --prefix services/products
```

### Run all tests
```bash
npm test
```

### Run tests for a single service
```bash
npm test --prefix services/users
npm test --prefix services/products
```

## Architecture

```
services/
  users/               Express app on port 3001
    src/api/
      users.js         Full CRUD route handlers (in-memory store lives here)
    app.js             Express app (no listen — importable by tests)
    index.js           Server bootstrap (calls app.listen)
    tests/
      users.test.js
  products/            Express app on port 3002
    src/api/
      products.js      Full CRUD route handlers (in-memory store lives here)
    app.js             Express app (no listen — importable by tests)
    index.js           Server bootstrap
    tests/
      products.test.js
package.json           Root — runs both via `concurrently`, runs all tests
```

Each service is a fully self-contained Express application with its own `package.json` and `node_modules`. The root `package.json` uses `concurrently` solely to start both processes together; there is no shared runtime code between services.

Route handlers live in `src/api/<service>.js`. `app.js` wires the router to the Express instance without starting the server, making it directly importable by tests via `jest.resetModules()`.

## API Endpoints

**Users service** — `http://localhost:3001`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/users` | List all users |
| GET | `/users/:id` | Get user by ID |
| POST | `/users` | Create user (`{ name, email }`) |
| PUT | `/users/:id` | Update user (`{ name?, email? }`) |
| DELETE | `/users/:id` | Delete user |

**Products service** — `http://localhost:3002`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/products` | List all products |
| GET | `/products/:id` | Get product by ID |
| POST | `/products` | Create product (`{ name, price, stock? }`) |
| PUT | `/products/:id` | Update product (`{ name?, price?, stock? }`) |
| DELETE | `/products/:id` | Delete product |

## Data Storage

Both services use in-memory arrays (no database). Data resets on every restart. To add persistence, replace the in-memory arrays in each `src/api/*.js` file with a database client.

## Port Configuration

Override the default ports via environment variables:
```bash
PORT=4001 npm start --prefix services/users
PORT=4002 npm start --prefix services/products
```
