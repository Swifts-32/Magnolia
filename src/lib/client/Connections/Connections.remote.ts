import { command } from "$app/server";
import { App } from "$lib/server/App.server.svelte";
import { error } from "@sveltejs/kit";
import { z } from "zod/v4";

export const writeToConnection = command(z.object({
  id: z.uuid(),
  command: z.string(),
}), async ({ id, command }) => {
  const connection = await App.getConnection(id);
  if (!connection) error(500, "Connection not found");

  connection.write(command);
});

