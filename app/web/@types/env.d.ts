declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ENVIRONMENT: "production" | "development";
      PORT: string;
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: string;
      NEXT_PUBLIC_COMING_SOON_MODE: string;
    }
  }
}

export {};
