# API Architecture Documentation

## 📁 Folder Structure

```
src/
├── api/
│   ├── apiClient.ts           # Central Axios instance with interceptors
│   ├── modules/
│   │   ├── auth.api.ts        # Authentication endpoints
│   │   ├── public.api.ts      # Public endpoints (no auth)
│   │   └── admin.api.ts       # Admin endpoints (auth required)
│   └── index.ts               # Central export
├── config/
│   └── env.ts                 # Environment configuration
├── types/
│   └── api.types.ts           # All API TypeScript types
└── utils/
    └── tokenManager.ts        # Secure token storage
```

## 🔧 Features

### 1. **Central API Client**
- Axios instance with base URL from environment
- 30-second timeout
- Automatic retry on network failure
- Request abortion support (prevents duplicate calls)

### 2. **Request Interceptor**
- Auto-injects `Authorization: Bearer {token}` header
- Reads token from localStorage

### 3. **Response Interceptor**
- **401 Unauthorized** → Clears auth, redirects to `/login`
- **403 Forbidden** → Redirects to `/403`
- **404 Not Found** → Returns error, no redirect
- **500 Server Error** → Logs error in development
- **Network Failure** → Returns user-friendly message
- **Timeout** → Returns timeout message

### 4. **Abort Controllers**
- Prevents duplicate API calls
- Each request can have an `abortKey`
- Previous request with same key is auto-aborted

### 5. **Type Safety**
- Full TypeScript support
- API response types
- Request payload types
- Pagination types

## 📖 Usage Examples

### Public API (No Auth)
```typescript
import { publicApi } from '@/api';

// Get all novels
const { items, pagination } = await publicApi.novels.getAll({
  page: 1,
  limit: 10,
  search: 'dragon',
});

// Get single novel
const novel = await publicApi.novels.getById('123');

// Get chapter with navigation
const chapter = await publicApi.chapters.getById('456');
const nav = await publicApi.chapters.getNavigation('456');
```

### Auth API
```typescript
import { authApi } from '@/api';
import { tokenManager } from '@/utils/tokenManager';

// Login
const { user, token } = await authApi.login({
  email: 'admin@example.com',
  password: 'password123',
});

tokenManager.setToken(token);
tokenManager.setUser(JSON.stringify(user));

// Signup
const response = await authApi.signup({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'secure123',
});
```

### Admin API (Auth Required)
```typescript
import { adminApi } from '@/api';

// Dashboard stats
const stats = await adminApi.dashboard.getStats();

// CRUD novels
const novel = await adminApi.novels.create({
  title: 'New Novel',
  author: 'Author Name',
  description: 'Description',
  coverImage: 'url',
  genre: 'Fantasy',
  status: 'ONGOING',
});

await adminApi.novels.update('123', { title: 'Updated Title' });
await adminApi.novels.delete('123');

// CRUD chapters
const chapter = await adminApi.chapters.create({
  novelId: '123',
  title: 'Chapter 1',
  content: 'Chapter content',
  chapterNumber: 1,
});
```

## 🛡️ Error Handling

All API calls return typed errors:

```typescript
try {
  const novel = await publicApi.novels.getById('123');
} catch (error) {
  console.error(error.status);    // 404
  console.error(error.message);   // "Novel not found"
  console.error(error.errors);    // Validation errors array
}
```

## 🔐 Token Management

```typescript
import { tokenManager } from '@/utils/tokenManager';

// Store
tokenManager.setToken('jwt-token');
tokenManager.setUser(JSON.stringify(user));

// Retrieve
const token = tokenManager.getToken();
const user = JSON.parse(tokenManager.getUser() || '{}');

// Check auth
if (tokenManager.isAuthenticated()) {
  // User is logged in
}

// Logout
tokenManager.clearAuth();
```

## 🌍 Environment Variables

`.env.development`
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_ENV=development
```

`.env.production`
```env
VITE_API_BASE_URL=https://api.thentamilnovels.com
VITE_APP_ENV=production
```

## ⚡ Performance Optimizations

1. **Request Abortion** - Prevents duplicate calls
2. **Abort on Unmount** - Cancel requests when component unmounts
3. **Type Safety** - Catch errors at compile time
4. **Centralized Error Handling** - No repeated try-catch blocks

## 📝 Best Practices

1. ✅ Always use typed payloads
2. ✅ Use abort keys for list fetching
3. ✅ Handle errors with user-friendly messages
4. ✅ Never store sensitive data in localStorage
5. ✅ Clear auth on 401 responses
