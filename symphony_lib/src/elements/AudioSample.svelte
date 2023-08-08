<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  import type { SymphonySpec } from "../types";
  import type { Writable } from "svelte/store";
  import { onDestroy } from "svelte";

  import WaveSurfer from "wavesurfer.js";
  import IconButton from "./IconButton.svelte";
  import { join } from "@fireflysemantics/join";

  import Fa from "svelte-fa";
  import { faPlay } from "@fortawesome/free-solid-svg-icons/faPlay";
  import { faPause } from "@fortawesome/free-solid-svg-icons/faPause";

  export let id: string;
  export let symphonySpec: Writable<SymphonySpec>;
  export let large: boolean = false;

  let container: HTMLDivElement;
  let wavesurfer: WaveSurfer;
  let playing: boolean = false;
  let oldId: string = "";

  $: if (container !== undefined && id !== oldId) {
    if (wavesurfer !== undefined) wavesurfer.destroy();
    container.innerHTML = "";
    wavesurfer = WaveSurfer.create({
      container: container,
      waveColor: "#cfcfcf",
      progressColor: "#0071e3",
    });
    wavesurfer.load(join($symphonySpec.filesPath, id));
    playing = false;
    oldId = id;
  }

  function changePlayStatus() {
    if (playing) {
      wavesurfer.pause();
      playing = false;
    } else {
      wavesurfer.play();
      playing = true;
    }
  }

  onDestroy(() => wavesurfer.destroy());
</script>

<div class="flex flex-col {large ? 'w-48 mx-1' : 'w-24 m-1'}">
  <div bind:this={container} on:click />
  <div>
    <IconButton on:click={changePlayStatus}>
      <Fa icon={playing ? faPause : faPlay} slot="icon" />
    </IconButton>
  </div>
</div>
