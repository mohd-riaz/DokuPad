# DokuPad – Real-Time Collaborative Document Editor

A full-stack **Google Docs–style editor** with real-time collaboration powered by **Yjs (CRDT)** and WebSockets, built using modern web technologies and a scalable architecture.

---

## Live Demo

 **Deployed App:** 
 https://dokupad.mohdriaz.com

<img width="1887" height="597" alt="image" src="https://github.com/user-attachments/assets/e022deae-da8c-4c01-b5c1-fb160ef31199" />

---

## Features

* Authentication with Clerk
* Create, edit, and delete documents
* Rich text editing with Tiptap
* Real-time collaboration using **Yjs (CRDT)**
* WebSocket-based synchronization
* Persistent storage with Convex
* Conflict-free merging of concurrent edits
* Responsive UI with Tailwind CSS

---

## Architecture

```text
Client (Next.js + Tiptap + Yjs)
        │
        │ WebSocket (Yjs updates)
        ▼
Yjs WebSocket Server
        │
        │ Sync + Broadcast
        ▼
Convex Backend (Persistence Layer)
```

---

## Real-Time Collaboration

This project uses **Yjs**, a CRDT (Conflict-free Replicated Data Type), to enable seamless multi-user editing.

### Key Properties

* Conflict-free updates (no overwrites)
* Efficient real-time synchronization
* Concurrent multi-user editing

### How it works

1. User edits content in Tiptap
2. Changes are converted into **Yjs updates**
3. Updates are sent over WebSockets
4. Server relays updates to connected clients
5. Clients merge updates automatically using CRDT

---

## Collaboration Access Control

- Real-time collaboration is **enabled only if the document was created while the user had an organization selected** in the Clerk organization switcher.
- Documents created without an organization are treated as **personal documents** and do **not** support real-time syncing.

This ensures that only users within the same organization can collaborate on shared documents, while personal documents remain private.

---

## Tech Stack

### Frontend

* Next.js (App Router)
* React
* Tailwind CSS

### Backend

* Convex (Database + serverless functions)

### Real-Time Layer

* Yjs (CRDT)
* y-socket.io

### Authentication

* Clerk

---

## Installation

Clone repository:
```bash
git clone https://github.com/mohd-riaz/DokuPad.git
cd DokuPad
```
Install client dependencies:
```bash
cd client
npm install --legacy-peer-deps
```
Install server dependencies:
```bash
cd server
npm install --legacy-peer-deps
```

---

## Running Locally

Start Next.js:
```bash
cd client
npm run dev
```
Start Convex backend:
```bash
cd client
npx convex dev
```
Start Y-socket.io server:
```bash
cd server
node server.js
```

---

## Deployment

* **Frontend:** Vercel
* **Backend:** Convex
* **Real-time server:** Render

---

## Key Learnings

* Designing **real-time collaborative systems**
* Implementing **CRDT-based synchronization (Yjs)**
* Managing **WebSocket communication**
* Handling **access control for collaborative environments**
* Integrating frontend, backend, and real-time layers

---

## License

MIT License
