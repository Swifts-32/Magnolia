<script lang="ts">
  import { fly } from "svelte/transition";

  let step = 0;

  const steps = [
    { title: "Step 1", content: "Enter your name" },
    { title: "Step 2", content: "Enter your email" },
    { title: "Step 3", content: "Review & Submit" }
  ];

  function next() {
    if (step < steps.length - 1) step++;
  }

  function back() {
    if (step > 0) step--;
  }

  function submit() {
    alert("Form submitted!");
    step = 0; // reset
  }
</script>

<!-- Full screen overlay -->
<div class="fixed inset-0 bg-gray-900/90 flex items-center justify-center text-white">
  <div class="relative w-full max-w-md p-6">
    {#each steps as s, i}
      {#if step === i}
        <div
          transition:fly={{ x: 200, duration: 300 }}
          class="absolute inset-0 bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col"
        >
          <h2 class="text-xl font-bold mb-4">{s.title}</h2>
          <p class="mb-6">{s.content}</p>

          <div class="mt-auto flex justify-between">
            {#if i > 0}
              <button
                on:click={back}
                class="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
              >
                Back
              </button>
            {/if}

            {#if i < steps.length - 1}
              <button
                on:click={next}
                class="ml-auto px-4 py-2 rounded bg-blue-600 hover:bg-blue-500"
              >
                Next
              </button>
            {:else}
              <button
                on:click={submit}
                class="ml-auto px-4 py-2 rounded bg-green-600 hover:bg-green-500"
              >
                Submit
              </button>
            {/if}
          </div>
        </div>
      {/if}
    {/each}
  </div>
</div>
