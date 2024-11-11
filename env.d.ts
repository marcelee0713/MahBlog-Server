declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      PORT: string;
      DATABASE_URL: string;
      REFRESH_TOKEN_SECRETKEY: string;
      ACCESS_TOKEN_SECRETKEY: string;
      EMAIL_CHANGE_SECRETKEY: string;
      EMAIL_VERIFICATION_SECRETKEY: string;
      RESET_PASSWORD_SECRETKEY: string;
      CLIENT_BASE_URL: string;
      ADMIN_USERNAME: string;
      ADMIN_PASSWORD: string;
      ADMIN_EMAIL_ADDRESS: string;
      SET_ID_CHARACTERS: string;
      EMAIL_SERVICE_PASSWORD: string;
      EMAIL_SERVICE_ADDRESS: string;
      EMAIL_SERVICE_USER: string;
      CLOUDINARY_CLOUD_NAME: string;
      CLOUDINARY_API_KEY: string;
      CLOUDINARY_API_SECRET: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      GOOGLE_CALLBACK_URL: string;
      GOOGLE_OAUTH_URL: string;
    }
  }
}

export {};
