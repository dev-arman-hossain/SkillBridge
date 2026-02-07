import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./pisma";

/** Default password set for users who sign in via OAuth (e.g. Google) so they can also sign in with email/password. */
const DEFAULT_OAUTH_PASSWORD = "12345678";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.BASE_URL || "http://localhost:5000",
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    // requireEmailVerification: true,
  },
  databaseHooks: {
    account: {
      create: {
        after: async (account, context) => {
          if (!context || account.providerId === "credential") return;
          const existing = await context.internalAdapter.findAccounts(account.userId);
          if (existing.some((a) => a.providerId === "credential")) return;
          const hash = await context.password.hash(DEFAULT_OAUTH_PASSWORD);
          await context.internalAdapter.linkAccount({
            userId: account.userId,
            providerId: "credential",
            accountId: account.userId,
            password: hash,
          });
        },
      },
    },
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirectURI: `${process.env.BASE_URL || "http://localhost:5000"}/api/auth/callback/google`,
    },
  },
});
