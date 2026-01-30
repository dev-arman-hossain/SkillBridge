// import { betterAuth } from "better-auth";
// import { prismaAdapter } from "better-auth/adapters/prisma";
// import { prisma } from "./pisma";

// export const auth = betterAuth({
//     database: prismaAdapter(prisma, {
//         provider: "postgresql",
//     }),
//     trustedOrigins: [process.env.APP_URL!],
//     emailAndPassword: {
//     enabled: true,
//   },
// });

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./pisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    // requireEmailVerification: true,
  },
});
