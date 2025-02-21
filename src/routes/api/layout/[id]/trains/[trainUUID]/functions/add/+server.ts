import type { LayoutUUID } from "$lib/client/LayoutClient.svelte.js";
import { LayoutServerHandler } from "$lib/server/layoutHandler.server.svelte";
import type { TrainUUID } from "$lib/server/Trains/Train.server.js";
import { ConvertFunctionData, type TrainFunctionData, type TrainFunctionModes, type TrainFunctionUUID } from "$lib/types/Trains/Functions/Functions.js";

export const POST = async ({ request, params }) => {
	const { id, trainUUID } = params;

	const layout = LayoutServerHandler.layouts.get(id as LayoutUUID);
	if (!layout) {
		return new Response(JSON.stringify({ message: `${id} is not a valid layout.` }), { status: 404 });
	}

	let train = layout.getTrain(trainUUID as TrainUUID);
	if (!train) {
		return new Response(JSON.stringify({ message: `${trainUUID} is not a valid train.` }), { status: 404 });
	}

	const data = await request.json();

	// Validate required field
	try {
		console.log(data);
		const trainFunctionData = ConvertFunctionData.toTrainFunctionData(data.message);

		train.addFunction(trainFunctionData.uuid as TrainFunctionUUID, trainFunctionData.value, trainFunctionData.name, trainFunctionData.icon, trainFunctionData.mode as TrainFunctionModes);

		return new Response(
			JSON.stringify({
				message: `Function created successfully on train: ${train.name}`,
			}),
			{ status: 201 }

		);
	}
	catch (error) {
		return new Response(
			JSON.stringify({ message: `Invalid function data: ${error}` }),
			{ status: 400 }
		);
	}

}