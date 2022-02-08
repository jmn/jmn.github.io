export function env(
    environment: "production" | "test" | "development"
  ): boolean {
    return process.env.NODE_ENV === environment;
  }