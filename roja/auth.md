# MyJKKN Auth Server Documentation

## Overview

MyJKKN Auth Server is a centralized OAuth 2.0 authentication service that provides secure authentication for all MyJKKN child applications. Built with security, scalability, and developer experience in mind.

**Features:**
- ⚡ Next.js 15 Ready - Full App Router support with Server & Client Components
- 🔒 Type-Safe Auth - Complete TypeScript support with generated types
- 🚀 Supabase Integration - Seamless integration with Supabase for data & auth

**Prerequisites:** You need a registered application ID and API key from the MyJKKN Auth Server. Contact your administrator to get started.

---

## Quick Start

Get up and running in 5 minutes with our OAuth 2.0 authentication flow.

### 1. Register Your Application

Contact your MyJKKN administrator to register your application. You'll receive:
- `client_id` - Your application identifier
- `api_key` - Your application API key
- `redirect_uri` - Approved callback URL

### 2. Install Dependencies

```bash
npm install @supabase/ssr jose
# or
yarn add @supabase/ssr jose
```

### 3. Configure Environment

```bash
# .env.local
NEXT_PUBLIC_AUTH_SERVER_URL=http://localhost:3000
NEXT_PUBLIC_APP_ID=your_app_id
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3001/callback
API_KEY=your_api_key
```

### 4. Create Login Handler

```typescript
const handleLogin = () => {
  const state = Math.random().toString(36).substring(7);
  localStorage.setItem('oauth_state', state);

  // Build OAuth URL
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_APP_ID!,
    redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI!,
    response_type: 'code',
    scope: 'read write profile',
    state: state
  });

  const authUrl = \`\${process.env.NEXT_PUBLIC_AUTH_SERVER_URL}/api/auth/authorize?\${params}\`;
  window.location.href = authUrl;
};
```

### 5. Create Callback Handler & Token API

Create `app/callback/page.tsx` and `app/api/token/route.ts` as shown in the integration section below.

---

## OAuth 2.0 Flow

### Flow Steps

1. **User Clicks Login** - Your app redirects the user to the Auth Server's authorization endpoint
2. **User Authenticates** - User logs in with their MyJKKN credentials (if not already logged in)
3. **Authorization Code Issued** - Auth Server redirects back to your app with an authorization code
4. **Exchange Code for Tokens** - Your backend exchanges the code for access and refresh tokens
5. **Access Protected Resources** - Use the access token to authenticate API requests

---

## API Reference

### GET /api/auth/authorize

Initiates the OAuth 2.0 authorization code flow. Redirects the user to the login page.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| client_id | string | Required | Your application's client ID |
| redirect_uri | string | Required | The URL to redirect to after authorization |
| response_type | string | Required | Must be 'code' |
| scope | string | Required | Space-separated list of scopes (e.g., 'read write profile') |
| state | string | Required | Random string for CSRF protection |

**Example Request:**

```http
GET https://auth.jkkn.ai/api/auth/authorize?
  client_id=your_client_id&
  redirect_uri=http://localhost:3000/callback&
  response_type=code&
  scope=read+write+profile&
  state=random_csrf_token
```

**Success Response:**

```http
HTTP/1.1 302 Found
Location: http://localhost:3000/callback?
  code=auth_code_here&
  state=random_csrf_token
```

---

### POST /api/auth/token

Exchange an authorization code or refresh token for access and refresh tokens.

**Authorization Code Grant:**

```json
{
  "grant_type": "authorization_code",
  "code": "auth_code_from_callback",
  "redirect_uri": "http://localhost:3001/callback",
  "app_id": "your_app_id",
  "api_key": "your_api_key"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "refresh_token_here",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "read write profile",
  "user": {
    "id": "user_uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "student",
    "institution_id": "institution_uuid"
  }
}
```

**Refresh Token Grant:**

```json
{
  "grant_type": "refresh_token",
  "refresh_token": "your_refresh_token",
  "app_id": "your_app_id",
  "api_key": "your_api_key"
}
```

---

## Next.js Integration

### 1. Install Dependencies

```bash
npm install @supabase/ssr
npm install jose # For JWT validation
```

### 2. Environment Variables

```bash
# Auth Server Configuration
NEXT_PUBLIC_AUTH_SERVER_URL=http://localhost:3000
NEXT_PUBLIC_APP_ID=your_app_id
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3001/callback
API_KEY=your_api_key
```

### 3. Login Handler

```typescript
'use client';

export default function LoginButton() {
  const handleLogin = () => {
    const state = Math.random().toString(36).substring(7);

    // Save state for CSRF validation
    localStorage.setItem('oauth_state', state);

    // Build OAuth URL with URLSearchParams
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_APP_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI!,
      response_type: 'code',
      scope: 'read write profile',
      state: state
    });

    const authUrl = \`\${process.env.NEXT_PUBLIC_AUTH_SERVER_URL}/api/auth/authorize?\${params}\`;
    window.location.href = authUrl;
  };

  return (
    <button onClick={handleLogin}>
      Login with MyJKKN
    </button>
  );
}
```

### 4. Callback Handler

Create `app/callback/page.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function CallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const oauthError = searchParams.get('error');
      const savedState = localStorage.getItem('oauth_state');

      // Check for OAuth errors
      if (oauthError) {
        setError(searchParams.get('error_description') || 'Authorization failed');
        return;
      }

      // Validate state (CSRF protection)
      if (state !== savedState) {
        setError('Invalid state parameter - possible CSRF attack');
        return;
      }

      if (!code) {
        setError('No authorization code received');
        return;
      }

      try {
        // Exchange code for tokens via backend
        const response = await fetch('/api/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error_description || 'Token exchange failed');
        }

        const data = await response.json();

        // Save tokens
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.removeItem('oauth_state');

        // Redirect to home
        router.push('/');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Authentication failed');
      }
    };

    handleCallback();
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Authentication Error
          </h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Authenticating...</h1>
        <p>Please wait while we complete your login.</p>
      </div>
    </div>
  );
}
```

### 5. Backend Token Exchange API

Create `app/api/token/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: 'invalid_request', error_description: 'Code required' },
        { status: 400 }
      );
    }

    // Exchange code for tokens
    const response = await fetch(
      \`\${process.env.NEXT_PUBLIC_AUTH_SERVER_URL}/api/auth/token\`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          code,
          app_id: process.env.NEXT_PUBLIC_APP_ID,
          api_key: process.env.API_KEY,
          redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    return NextResponse.json(
      { error: 'server_error', error_description: 'Token exchange failed' },
      { status: 500 }
    );
  }
}
```

---

## Protected Routes & API

### Protected Page Component

```typescript
'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1>Welcome, {user.full_name}</h1>
      <p>Role: {user.role}</p>
    </div>
  );
}
```

### Validate Token in API Routes

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { authConfig } from '@/lib/auth/config';

export async function GET(request: NextRequest) {
  // Get token from Authorization header
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Validate token with Auth Server
  const response = await fetch(\`\${authConfig.authServerUrl}/api/auth/validate\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      access_token: token,
      child_app_id: authConfig.clientId
    })
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }

  const { user } = await response.json();

  // Your protected API logic here
  return NextResponse.json({
    message: 'Success',
    user
  });
}
```

### Using with Supabase

```typescript
import { createClient } from '@supabase/supabase-js';

// Validate auth token first
const { user } = await validateToken(token);

// Then use Supabase with RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Query your app data (RLS will use user.id)
const { data, error } = await supabase
  .from('your_table')
  .select('*')
  .eq('user_id', user.id);

return NextResponse.json({ data });
```

---

## Troubleshooting

**Invalid client_id error**
Make sure your client_id is correct and that your application is registered with the Auth Server. Contact your administrator to verify.

**Invalid redirect_uri error**
The redirect_uri must exactly match one of the approved URIs registered for your application. Check for trailing slashes and protocol (http vs https).

**Token expired error**
Access tokens expire after 1 hour. Use the refresh token to obtain a new access token without requiring the user to log in again.

**CORS errors**
The Auth Server supports CORS for allowed domains. Make sure your domain is registered. For development, use http://localhost with the correct port.

**Invalid API key**
The X-API-Key header must be included in all token exchange requests. Verify your API key is correct and hasn't been rotated.

---

*Documentation generated for MyJKKN Auth Server*
