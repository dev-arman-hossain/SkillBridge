import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

/** Default password set for users who sign in via OAuth (e.g. Google) so they can also sign in with email/password. */
const DEFAULT_OAUTH_PASSWORD = "12345678";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.BASE_URL || "http://localhost:5000",
  trustedOrigins: [process.env.APP_URL!],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: false,
    },
    disableCSRFCheck: true,
  },
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
  },
  databaseHooks: {
    account: {
      create: {
        after: async (account, context) => {
          if (!context?.context || account.providerId === "credential") return;
          const ctx = context.context;
          const existing = await ctx.internalAdapter.findAccounts(account.userId);
          if (existing.some((a: { providerId: string }) => a.providerId === "credential")) return;
          const hash = await ctx.password.hash(DEFAULT_OAUTH_PASSWORD);
          await ctx.internalAdapter.linkAccount({
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
