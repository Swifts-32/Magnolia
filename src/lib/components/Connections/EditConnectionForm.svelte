<script lang="ts">
  import { toast } from "svelte-sonner";
  import type { Connection } from "$lib/server/db/schema/connection";
  import ConnectionFormProtocol from "./FormComponents/ConnectionFormProtocol.svelte";
  import ConnectionFormType from "./FormComponents/ConnectionFormType.svelte";
  import ConnectionFormName from "./FormComponents/ConnectionFormName.svelte";
  import ConnectionFormHardware from "./FormComponents/ConnectionFormHardware.svelte";
  import { editConnection } from "$lib/client/Connections.remote";
  import InputField from "../Form/InputField.svelte";
  import FormSelect from "./FormComponents/FormSelect.svelte";
  import { connectionProtocolList } from "$lib/types/Protocols";

  interface Props {
    connection: Connection;
  }

  let { connection }: Props = $props();

  const editConnForm = $derived(editConnection.for(connection.uuid));
  const { name, hardware, protocol, layoutId, uuid } = $derived(
    editConnForm.fields,
  );
</script>

<form
  {...editConnForm.enhance(async (form) => {
    try {
      if (await form.submit()) {
        form.element.reset();

        toast.success("Edited connection");
      }
    } catch (error) {
      toast.error("Error editing connection: " + error);
    }
  })}
  oninput={() => editConnForm.validate()}
  id="edit-connection-form"
  class="flex-col flex gap-2 w-full max-w-none"
>
  <input {...layoutId.as("hidden", connection.layoutUuid)} />
  <input {...uuid.as("hidden", connection.uuid)} />

  <InputField id="name" label="Name" value={connection.name} field={name} />

  <ConnectionFormProtocol {protocol} />

  <!-- <FormSelect formElement={protocol} values={connectionProtocolList} /> -->

  <ConnectionFormType {hardware} />

  <ConnectionFormHardware {hardware} />
</form>
