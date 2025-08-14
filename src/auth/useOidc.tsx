// src/auth/useOidcLite.ts
import { useEffect, useMemo, useRef, useState } from 'react';
import { setupOidcWorker } from './oidcWorkerClient';

export type OidcEnv = {
  authority: string;
  clientId: string;
  responseMode?: 'query' | 'fragment';
  scopePrefix?: string;   // keep '' unless you actually prefix scopes
  extraScopes?: string;   // '' if none
};

type InitResponse = { error?: string } | undefined;
type GetAccessTokenResponse = {
  accessToken?: string;
  accessTokenPayload?: unknown;
  redirect?: string;
  codeVerifier?: string;
  state?: string;
  error?: string;
} | undefined;
type ExchangeResponse = {
  success?: boolean;
  accessToken?: string;
  accessTokenPayload?: unknown;
  error?: string;
} | undefined;

export function useOidc(env: OidcEnv) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setErr] = useState<string | null>(null);

  const OW = useMemo(() => setupOidcWorker(), []);
  const booted = useRef(false);

  useEffect(() => {
    if (booted.current) return; // StrictMode guard
    booted.current = true;

    (async () => {
      try {
        const url = new URL(window.location.href);
        const redirectUri = `${url.origin}${url.pathname}`;
        const paramStr =
          url.hash ? url.hash.slice(1) : url.search ? url.search.slice(1) : '';

        // 0) If OP returned an error, surface once and stop
        if (paramStr) {
          const p = new URLSearchParams(paramStr);
          const err = p.get('error');
          if (err) {
            const desc = p.get('error_description') ?? '';
            setErr(`${err}${desc ? `: ${decodeURIComponent(desc)}` : ''}`);
            setLoading(false);
            window.history.replaceState(window.history.state, '', redirectUri);
            sessionStorage.removeItem('codeVerifier');
            sessionStorage.removeItem('oidcState');
            return;
          }
        }

        // 1) initialize the worker
        const init = (await OW.sendWorkerRequest({
          request: 'initialize',
          redirectUri,
          env,
        })) as InitResponse;
        if (init?.error) {
          setErr(init.error);
          setLoading(false);
          return;
        }

        // 2) came back with code? exchange exactly once
        if (paramStr) {
          const p = new URLSearchParams(paramStr);
          const code = p.get('code');
          const state = p.get('state');
          const storedState = sessionStorage.getItem('oidcState');
          const codeVerifier = sessionStorage.getItem('codeVerifier') ?? '';

          if (code && state && storedState && state === storedState) {
            if (sessionStorage.getItem('oidcExchangeLock')) return; // single-flight
            sessionStorage.setItem('oidcExchangeLock', '1');

            // wipe URL **before** async call to avoid double-exchange
            window.history.replaceState(window.history.state, '', redirectUri);

            try {
              const ex = (await OW.sendWorkerRequest({
                request: 'exchangeCodeForToken',
                code,
                codeVerifier,
                clientId: env.clientId,
                redirectUri,
              })) as ExchangeResponse;

              if (ex?.success && ex.accessToken) {
                setToken(ex.accessToken);
                setLoading(false);
              } else {
                setErr(ex?.error ?? 'Failed to exchange code for token');
                setLoading(false);
              }
            } finally {
              sessionStorage.removeItem('codeVerifier');
              sessionStorage.removeItem('oidcState');
              sessionStorage.removeItem('oidcExchangeLock');
            }
            return;
          }
        }

        // 3) no code → ask for token, else redirect
        const got = (await OW.sendWorkerRequest({
          request: 'getAccessToken',
        })) as GetAccessTokenResponse;

        if (got?.accessToken) {
          setToken(got.accessToken);
          setLoading(false);
        } else if (got?.redirect) {
          if (got.codeVerifier) sessionStorage.setItem('codeVerifier', got.codeVerifier);
          if (got.state) sessionStorage.setItem('oidcState', got.state);
          window.location.href = got.redirect;
        } else {
          setErr(got?.error ?? 'Unknown auth response');
          setLoading(false);
        }
      } catch (e: any) {
        setErr(e?.message ?? String(e));
        setLoading(false);
      }
    })();
  }, [OW, env]);

  const logout = async () => {
    try {
      await OW.logout();
    } catch (e: any) {
      setErr(e?.message ?? String(e));
    }
  };

  return { token, loading, error, logout };
}
