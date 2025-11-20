<p align="center">
  <a href="#" target="blank"><img src="https://img.icons8.com/color/96/000000/ticket.png" width="120" alt="Event Booking Logo" /></a>
</p>

<h1 align="center">BookTix Backend</h1>

<p align="center">
  A scalable and efficient <a href="https://nestjs.com/" target="_blank">NestJS</a> backend for managing events, tickets, and bookings. Built using Node.js, MongoDB, and TypeScript.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@nestjs/core" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version"></a>
  <a href="https://www.npmjs.com/package/@nestjs/core" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="License"></a>
  <a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"></a>
  <a href="https://img.shields.io/badge/status-in%20development-orange" alt="Status"></a>
</p>

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)

---

## Features

- User authentication & role-based access (Customer / Admin)
- Event management (CRUD for admins)
- Ticket types and seat inventory
- Booking & checkout with payment integration (mock/Stripe)
- QR code generation for tickets
- Admin dashboard with analytics
- Postgres  database with Drizzle schemas
- Validation, error handling, and clean API responses

---

## Tech Stack

- **Backend Framework:** NestJS (Node.js + TypeScript)
- **Database:** Postgres  + Supabase + Drizzle
- **Authentication:** JWT (access + refresh tokens)
- **Validation:** class-validator + class-transformer
- **QR / PDF Generation:** qrcode / pdfkit
- **Payments:** Stripe / Mocked
- **Deployment Ready:** Render

---

## Getting Started

Clone the repository:

```bash
git clone https://github.com/HarshAghera/event-booking-backend.git
cd event-booking-backend
```
