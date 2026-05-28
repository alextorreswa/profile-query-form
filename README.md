# React Hook Form with TanStack Query

This project demonstrates how to integrate React Hook Form with TanStack Query and JSON Server.

## Features

- Fetches profile data from a mock REST API
- Uses React Hook Form for form state
- Uses TanStack Query for server state
- Updates data using PUT requests
- Invalidates cache after successful mutation
- Disables the save button when there are no changes
- Displays server-style email conflict errors

## Technologies

- React
- Vite
- React Hook Form
- TanStack Query
- JSON Server

## How to Run

Install dependencies:

npm install

Start JSON Server:

npm run server

Start React app:

npm run dev

Open:

http://localhost:5173

## Test Cases

Normal cases:
1. Update username and save.
2. Update bio and save.
3. Toggle notifications and save.

Edge cases:
1. Leave username empty.
2. Enter invalid email format.
3. Enter conflict@example.com to simulate a server email conflict.