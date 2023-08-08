<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import Pagination from "../src/elements/Pagination.svelte";
  import { writable } from "svelte/store";
  import "./utils.css";
  import { SymphonyDataType } from "../src/types";
  import AudioSample from "../static/symphony-audio-sample.mp3"

  import * as aq from "arquero";

  let imageTable = aq.table({
    id: [
      "/200?random=1",
      "/200?random=2",
      "/200?random=3",
      "/200?random=4",
      "/200?random=5",
    ],
  });
  let audioTable = aq.table({
    id: [
      AudioSample,
      AudioSample,
      AudioSample,
      AudioSample,
      AudioSample,
    ],
  });
  let tabularTable = aq.table({
    id: ["row1", "row2", "row3", "row4", "row5"],
  });
</script>

<Meta
  title="Pagination"
  component={Pagination}
  argTypes={{
    type: {
      control: { type: "select", options: ["image", "audio", "tabular"] },
    },
  }}
/>

<Template let:args>
  <Pagination
    title={args.title}
    filteredTable={args.filteredTable[args.type]}
    selected={args.selected}
    symphonySpec={args.specs[args.type]}
    tooltip={args.tooltips[args.type]}
  >
    <div slot="extra">Extra content can be placed here.</div>
  </Pagination>
</Template>

<Story
  name="Default"
  args={{
    type: "image",
    title: "Image List",
    filteredTable: {
      image: imageTable,
      audio: audioTable,
      tabular: tabularTable,
    },
    selected: writable([]),
    specs: {
      image: writable({
        idColumn: "id",
        filesPath:
          "https://picsum.photos/",
        instancesPerPage: 3,
        dataType: SymphonyDataType.IMAGE,
      }),
      audio: writable({
        idColumn: "id",
        filesPath: "",
        instancesPerPage: 3,
        dataType: SymphonyDataType.AUDIO,
      }),
      tabular: writable({
        idColumn: "id",
        instancesPerPage: 3,
        dataType: SymphonyDataType.TABULAR,
      }),
    },
    tooltips: {
      image: writable({
        hover: true,
        mousePos: { x: 0, y: 0 },
        fetchPrefix:
        "https://picsum.photos/",
        number: 941,
        instance: {
          id: "/200?random=1",
        },
      }),
      audio: writable({
        hover: true,
        mousePos: { x: 0, y: 0 },
        filesPath: "",
        number: 941,
        instance: {
          id: AudioSample,
        },
      }),
      tabular: writable({
        hover: true,
        mousePos: { x: 0, y: 0 },
        number: 941,
        instance: {
          id: "row1",
        },
      }),
    },
  }}
/>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
