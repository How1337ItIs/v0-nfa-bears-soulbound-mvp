// Global type declarations for the NFA Bears MVP

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
    };
  }
}

export {};