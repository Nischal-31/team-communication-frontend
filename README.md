# Team Communication Platform — Frontend

## Overview

The **Team Communication Platform frontend** is a React + TypeScript application for real-time team collaboration.

It provides a Slack/Teams-style interface where users can register, log in, create and manage teams and channels, communicate in real time, and manage team members.

The frontend communicates with a **Spring Boot REST API** and uses **STOMP/WebSocket** for real-time messaging.

## Features

### Authentication

* User registration
* User login
* JWT-based authentication
* Persistent login using `localStorage`
* Logout
* Protected dashboard

### Teams

* View teams the current user belongs to
* Create a new team
* Automatically select newly created teams
* Switch between teams

### Channels

* View channels for the selected team
* Create channels
* Switch between channels
* Display channel descriptions
* Backend-protected general channel

### Team Members

* View team members
* Display member roles:

  * `OWNER`
  * `ADMIN`
  * `MEMBER`
* Add existing users to a team by username
* Promote members to admin
* Demote admins to members
* Remove members
* Permission-aware member controls

### Messaging

* Load existing channel messages
* Send messages
* Real-time message delivery through WebSocket
* Edit messages
* Delete messages
* Display edited status
* Permission-aware message actions

### Real-Time Communication

The application uses STOMP over WebSocket.

```text
React
   │
   │ STOMP
   ▼
ws://localhost:8081/ws
   │
   ▼
Spring Boot
```

Messages are sent through:

```text
/app/channels/{channelId}/send
```

Messages are received through:

```text
/topic/channels/{channelId}
```

## Technology Stack

### Frontend

* React
* TypeScript
* Vite
* CSS
* STOMP.js

### Backend

* Spring Boot
* Spring Security
* JWT
* Spring Data JPA
* Hibernate
* PostgreSQL
* WebSocket / STOMP

### Development Tools

* Node.js
* npm
* IntelliJ IDEA
* Postman
* PostgreSQL

## Project Structure

```text
team-communication-frontend/
│
├── public/
│
├── src/
│   │
│   ├── components/
│   │   ├── ChannelCreateForm.tsx
│   │   ├── ChannelSidebar.tsx
│   │   ├── LoginForm.tsx
│   │   ├── MemberSidebar.tsx
│   │   ├── MessageInput.tsx
│   │   ├── MessageList.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── TeamCreateForm.tsx
│   │   └── TeamSidebar.tsx
│   │
│   ├── pages/
│   │   ├── DashboardPage.tsx
│   │   └── LoginPage.tsx
│   │
│   ├── Services/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── websocket.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Requirements

Make sure the following are installed:

* Node.js
* npm
* PostgreSQL
* Running Team Communication Platform Spring Boot backend

The backend should be running on:

```text
http://localhost:8081
```

The frontend runs on:

```text
http://localhost:5173
```

## Installation

Clone the repository:

```bash
git clone <your-repository-url>
```

Navigate to the frontend project:

```bash
cd team-communication-frontend
```

Install dependencies:

```bash
npm install
```

## Run the Application

Start the Vite development server:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

## Backend Configuration

The frontend currently communicates with:

```text
http://localhost:8081
```

The REST API base URL is configured in:

```text
src/Services/api.ts
```

Example:

```typescript
const API_URL = "http://localhost:8081";
```

The WebSocket endpoint is configured in:

```text
src/Services/websocket.ts
```

Example:

```typescript
const WS_URL = "ws://localhost:8081/ws";
```

## Authentication Flow

The login process works as follows:

```text
User
 │
 ▼
Login Form
 │
 ▼
POST /api/auth/login
 │
 ▼
Spring Boot
 │
 ▼
JWT Token
 │
 ▼
localStorage
 │
 ▼
Dashboard
```

The JWT is automatically attached to REST requests:

```http
Authorization: Bearer <JWT>
```

The same JWT is sent during the STOMP WebSocket connection.

## Registration Flow

New users can create an account through the registration form.

The frontend sends:

```http
POST /api/users
```

with:

```json
{
  "username": "alice2",
  "email": "alice2@example.com",
  "password": "secret123"
}
```

After successful registration, the user can log in.

## Real-Time Messaging Flow

When a user sends a message:

```text
MessageInput
      │
      ▼
DashboardPage
      │
      ▼
sendMessage()
      │
      ▼
/app/channels/{channelId}/send
      │
      ▼
Spring Boot
      │
      ├── Save message to PostgreSQL
      │
      └── Broadcast message
              │
              ▼
      /topic/channels/{channelId}
              │
              ▼
        React subscribers
```

This allows multiple users in the same channel to receive messages without refreshing the page.

## User Roles

The application uses three team roles:

| Role     | Capabilities                                            |
| -------- | ------------------------------------------------------- |
| `OWNER`  | Manage team members, manage channels, moderate messages |
| `ADMIN`  | Manage channels and moderate messages                   |
| `MEMBER` | View channels, send messages, edit/delete own messages  |

The backend remains the final authority for authorization. The frontend only displays or hides controls based on the current user's role.

## Team Management

Authenticated users can create teams.

When a user creates a team, they become the team `OWNER`.

Example:

```text
Bob
 │
 ├── Creates "Development Team"
 │
 └── Bob → OWNER
```

The team owner can add existing registered users by username:

```http
POST /api/teams/{teamId}/members
```

Example:

```json
{
  "username": "alice2"
}
```

The new member is added with:

```text
MEMBER
```

The owner can subsequently promote the user to `ADMIN`.

## Channel Management

Channels belong to teams.

Example:

```text
Development Team
├── # general
├── # backend
└── # devops
```

Channel creation is handled through:

```http
POST /api/teams/{teamId}/channels
```

Channel access is inherited from team membership. There is currently no separate channel-membership model.

## Message Permissions

Members can:

* Send messages
* Edit their own messages
* Delete their own messages

Owners and admins can:

* Moderate messages
* Delete messages from other users

Authorization is ultimately enforced by the backend.

## Error Handling

The frontend handles:

* Failed API requests
* Invalid login credentials
* WebSocket connection errors
* Invalid form input
* Duplicate team membership
* Unauthorized operations
* Failed message updates
* Failed message deletion

Development errors are also logged to the browser console.

## Development Commands

Start the development server:

```bash
npm run dev
```

Build the production application:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Architecture

```text
┌──────────────────────────────────────┐
│          React Frontend              │
│                                      │
│  Authentication                      │
│  Teams                               │
│  Channels                            │
│  Members                             │
│  Messages                            │
└──────────────────┬───────────────────┘
                   │
             REST + WebSocket
                   │
                   ▼
┌──────────────────────────────────────┐
│         Spring Boot Backend          │
│                                      │
│  JWT Authentication                  │
│  Team Management                     │
│  Channel Management                  │
│  Message Management                  │
│  STOMP WebSocket                     │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│             PostgreSQL               │
│                                      │
│  users                               │
│  teams                               │
│  team_members                        │
│  channels                            │
│  messages                            │
└──────────────────────────────────────┘
```

## Future Improvements

Planned improvements include:

* Loading indicators
* Toast notifications
* Session expiration handling
* Message search
* Unread message indicators
* Online presence
* Typing indicators
* Message reactions
* Threads and replies
* File attachments
* Message pagination
* Mobile UI improvements
* Docker deployment
* CI/CD
* Cloud deployment

## Author

**Nischal Moktan**

Backend Developer | DevOps | Cloud Enthusiast

## License

This project is currently intended for learning, portfolio, and development purposes.
