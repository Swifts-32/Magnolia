import type { LayoutUUID } from '$lib/client/LayoutClient.svelte.js';
import { db } from '$lib/server/db/index.js';
import { LayoutTable } from '$lib/server/db/schema/layouts.js';
import { LayoutServerHandler } from '$lib/server/layoutHandler.server.svelte.js';

export const POST = async ({ request }) => {
  try {
    const data = await request.json();

    // Validate required fields
    const layoutName = data.layoutName;

    if (!layoutName) {
      return new Response(
        JSON.stringify({ message: 'Missing required fields: layoutName is required' }),
        { status: 400 }
      );
    }

    const layouts = await db.insert(LayoutTable).values({
      name: layoutName,
      position: 0,
    }).returning();

    const layout = layouts[0];
    LayoutServerHandler.addNewLayout(layout.name, layout.uuid as LayoutUUID, layout.position);

    return new Response(
      JSON.stringify({
        message: 'Layout created successfully',
      }),
      { status: 201 }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Invalid request body' }),
      { status: 400 }
    );
  }
}