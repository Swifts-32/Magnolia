import { defineEnvVars } from "@sveltejs/kit/env";

export const variables = defineEnvVars({
  DATABASE_URL: {
    schema: (input) => {
      if (!input?.trim()) {
        throw new Error("Define a Database URL");
      }
      return input;
    },
  },
});
