// @ts-nocheck
// src/auth/oidcWorkerClient.js
export function setupOidcWorker() {
  const worker = new SharedWorker('/oidc-worker.js', { name: 'oidc-worker', type: 'module' });
  const port = worker.port;
  port.start();

  const bc = new BroadcastChannel('stigman-oidc-worker');

  const OW = {
    token: null,
    tokenParsed: null,
    worker,
    bc,

    async logout() {
      const response = await this.sendWorkerRequest({ request: 'logout' });
      if (response?.success) {
        this.token = null;
        this.tokenParsed = null;
        window.location.href = response.redirect;
      }
    },

    sendWorkerRequest(request) {
      const requestId = crypto.randomUUID();
      port.postMessage({ ...request, requestId });

      return new Promise((resolve) => {
        function onMessage(event) {
          if (event.data?.requestId === requestId) {
            port.removeEventListener('message', onMessage);
            resolve(event.data.response);
          }
        }
        port.addEventListener('message', onMessage);
      });
    },

    postContextActiveMessage() {
      port.postMessage({ requestId: 'contextActive' });
    },
  };

  // BroadcastChannel updates token locally
  bc.addEventListener('message', (event) => {
    const { type, accessToken, accessTokenPayload } = event.data || {};
    if (type === 'accessToken') {
      OW.token = accessToken || null;
      OW.tokenParsed = accessTokenPayload || null;
    } else if (type === 'noToken') {
      OW.token = null;
      OW.tokenParsed = null;
    }
  });

  return OW;
}
// src/auth/oidcWorkerClient.ts
// export interface OidcWorkerRequest extends Record<string, unknown> {
//   request: string;
//   requestId?: string;
// }

// export interface LogoutResponse { success?: boolean; redirect?: string }

// export interface OidcWorkerClient {
//   sendWorkerRequest<T = unknown>(req: OidcWorkerRequest): Promise<T>;
//   logout(): Promise<void>;
// }

// export function setupOidcWorker(): OidcWorkerClient {
//   const worker = new SharedWorker('/oidc-worker.js', { name: 'oidc-worker', type: 'module' });
//   const port = worker.port;
//   port.start();

//   function sendWorkerRequest<T = unknown>(request: OidcWorkerRequest): Promise<T> {
//     const requestId = crypto.randomUUID();
//     port.postMessage({ ...request, requestId });
//     return new Promise<T>((resolve) => {
//       const onMessage = (event: MessageEvent<{ requestId?: string; response?: T }>) => {
//         if (event.data?.requestId === requestId) {
//           port.removeEventListener('message', onMessage as EventListener);
//           resolve(event.data.response as T);
//         }
//       };
//       port.addEventListener('message', onMessage as EventListener);
//     });
//   }

//   async function logout(): Promise<void> {
//     const res = await sendWorkerRequest<LogoutResponse>({ request: 'logout' });
//     if (res?.success && res.redirect) window.location.href = res.redirect;
//   }

//   return { sendWorkerRequest, logout };
// }
