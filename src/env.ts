import { building } from "$app/env";
import { defineEnvVars } from "@sveltejs/kit/env";

export const variables = defineEnvVars({
  DATABASE_URL: {
    schema: (input) => {
      if (building)
        return (
          input ??
          "postgresql://placeholder:placeholder@localhost:5432/placeholder"
        );
      if (!input?.trim()) {
        throw new Error("Define a Database URL");
      }
      return input;
    },
  },
});
