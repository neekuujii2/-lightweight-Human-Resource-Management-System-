/// <reference types="vite/client" />

declare module '@insforge/sdk' {
  export function createClient(config: { baseUrl: string; anonKey: string }): any;
}
