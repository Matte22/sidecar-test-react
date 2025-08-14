// // @ts-nocheck
// src/AuthDemo.tsx
import React from 'react';
import { useOidc } from './useOidc';

// example OAUTH_ENV for your useOidc(...)
const OAUTH_ENV = {
  authority: 'http://localhost:8080/realms/stigman', // your issuer base
  clientId: 'stig-manager',
  responseMode: 'query',            // or 'fragment' if you prefer

  // prevent "undefined…" in scope building
  scopePrefix: '',                  // '' unless you actually prefix scopes
  extraScopes: '',                  // optional (space-separated), keep '' if none

  strictPkce: true,                 // worker checks S256 support

  // token validation expectations
  claims: {
    scope: 'scope',                 // Azure AD uses 'scp'; Keycloak needs a mapper
    username: 'preferred_username',
    privileges: 'realm_access.roles',
    name:"name",
    privilegesChain: "realm_access.roles",
    email: "email",
    assertion: "jti"
  },

  // idle handling (minutes)
  idleTimeoutAdmin: 30,
  idleTimeoutUser: 15,

  // optional audience check; set only if your access token 'aud' must match
  // audienceValue: 'your-api-audience'
};


export default function AuthDemo() {
  const { token, tokenParsed, loading, error, login, logout } = useOidc(OAUTH_ENV);

  console.log('AuthDemo', { token, tokenParsed, loading, error });

  if (loading) return <p>Loading auth…</p>;
  if (error) return (
    <div>
      <p style={{ color: 'crimson' }}>Auth error: {error}</p>
      <button onClick={login}>Try Sign In</button>
    </div>
  );

  if (!token) return <button onClick={login}>Sign In</button>;

  return (
    <div style={{ wordBreak: 'break-all' }}>
      <p><strong>Access Token</strong></p>
      <code>{token}</code>
      <p style={{ marginTop: 12 }}><strong>Parsed payload</strong></p>
      <pre>{JSON.stringify(tokenParsed, null, 2)}</pre>
      <button onClick={logout} style={{ marginTop: 12 }}>Log out</button>
    </div>
  );
}
