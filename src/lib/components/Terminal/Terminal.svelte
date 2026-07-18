<script lang="ts">
  import { slide } from "svelte/transition";
  import { Button } from "../ui/button";
  import { Input } from "../ui/input";

  interface LogEntry {
    timestamp: string;
    text: string;
    type: "in" | "out" | "info";
  }

  interface Props {
    name?: string;
    logs?: LogEntry[];
    write: (data: string) => void;
    minimized?: boolean;
    placeholder?: string;
  }

  let {
    name = "Terminal",
    logs = $bindable([]),
    write,
    minimized = $bindable(false),
    placeholder = "Enter a command",
  }: Props = $props();

  let value: string = $state("");
  let div: HTMLDivElement | null = $state(null);

  export function addLog(text: string, type: "in" | "out" | "info" = "info") {
    const timestamp = new Date().toLocaleTimeString();
    logs.push({ timestamp, text, type });

    // Defer scrolling slightly to let the DOM update
    setTimeout(() => {
      if (div) {
        div.scrollTop = div.scrollHeight;
      }
    }, 1);
  }

  async function handleSend() {
    if (!value.trim()) return;

    addLog(value, "out");

    write(value);
    value = ""; // Clear input for next command
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      handleSend();
    }
  }
</script>

<div
  class="flex flex-col rounded-lg border border-neutral-800 bg-neutral-950 overflow-hidden shadow-2xl"
>
  <div
    class="flex items-center justify-between px-4 py-2 bg-neutral-900 border-b border-neutral-800"
  >
    <div class="flex items-center gap-3 min-w-0 flex-1">
      <button
        onclick={() => (minimized = !minimized)}
        class="group flex items-center justify-center w-5 h-5 rounded-md hover:bg-neutral-800 transition"
        aria-label={minimized ? "Maximize Terminal" : "Minimize Terminal"}
      >
        {#if minimized}
          <svg
            class="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        {:else}
          <svg
            class="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 12h-15"
            />
          </svg>
        {/if}
      </button>

      <span
        class="text-xs font-mono font-semibold text-neutral-400 whitespace-nowrap"
        >{name}</span
      >

      {#if minimized && logs.length > 0}
        <div
          class="flex items-center gap-2 text-xs font-mono text-neutral-500 truncate ml-2 border-l border-neutral-800 pl-3"
        >
          <span class="text-[10px] text-neutral-600 select-none"
            >[{logs[logs.length - 1].timestamp}]</span
          >
          {#if logs[logs.length - 1].type === "out"}
            <span class="text-cyan-500/80 font-bold text-[10px]">TX &gt;</span>
            <span class="text-cyan-200/60 truncate"
              >{logs[logs.length - 1].text}</span
            >
          {:else if logs[logs.length - 1].type === "in"}
            <span class="text-emerald-500/80 font-bold text-[10px]"
              >RX &lt;</span
            >
            <span class="text-emerald-200/60 truncate"
              >{logs[logs.length - 1].text}</span
            >
          {:else}
            <span class="text-neutral-500 italic truncate"
              >{logs[logs.length - 1].text}</span
            >
          {/if}
        </div>
      {/if}
    </div>

    {#if !minimized}
      <button
        onclick={() => (logs = [])}
        class="text-xs font-mono text-neutral-500 hover:text-neutral-300 transition"
      >
        Clear Logs
      </button>
    {/if}
  </div>

  {#if !minimized}
    <div
      transition:slide={{ duration: 250 }}
      class="flex flex-col overflow-hidden"
    >
      <div
        bind:this={div}
        class="no-scrollbar h-72 p-4 overflow-y-auto font-mono text-sm space-y-1.5 scroll-smooth select-text"
      >
        {#if logs.length === 0}
          <div class="text-neutral-600 italic">
            No activity registered yet...
          </div>
        {/if}
        {#each logs as log}
          <div class="flex items-start gap-2">
            <span class="text-neutral-600 select-none text-xs leading-5"
              >[{log.timestamp}]</span
            >
            {#if log.type === "out"}
              <span class="text-cyan-400 select-none font-bold">TX &gt;</span>
              <span class="text-cyan-100 break-all">{log.text}</span>
            {:else if log.type === "in"}
              <span class="text-emerald-400 select-none font-bold">RX &lt;</span
              >
              <span class="text-emerald-100 break-all">{log.text}</span>
            {:else}
              <span class="text-yellow-500 select-none font-bold">SYS *</span>
              <span class="text-neutral-400 italic break-all">{log.text}</span>
            {/if}
          </div>
        {/each}
      </div>

      <div class="flex p-3 bg-neutral-900 border-t border-neutral-800 gap-2">
        <div class="relative flex-1">
          <span
            class="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-cyan-500 font-bold pointer-events-none select-none"
          >
            &gt;
          </span>
          <Input
            bind:value
            onkeydown={handleKeyDown}
            {placeholder}
            class="h-10 pl-8 font-mono bg-neutral-950 border-neutral-800 text-emerald-400 focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500 focus-visible:ring-0 placeholder:text-neutral-700"
          />
        </div>
        <Button onclick={handleSend}>Send</Button>
      </div>
    </div>
  {/if}
</div>

<style>
  .no-scrollbar::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }
  .no-scrollbar {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
</style>
