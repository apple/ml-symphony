<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import DataSampleDetail from "../src/elements/DataSampleDetail.svelte";
  import { writable } from "svelte/store";
  import "./utils.css";
  import { SymphonyDataType } from "../src/types";
  import AudioSample from "../static/symphony-audio-sample.mp3"
</script>

<Meta
  title="DataSampleDetail"
  component={DataSampleDetail}
  argTypes={{
    type: {
      control: { type: "select", options: ["image", "audio", "tabular"] },
    },
  }}
/>

<Template let:args>
  <DataSampleDetail
    symphonySpec={args.specs[args.type]}
    tooltip={args.tooltips[args.type]}
  />
</Template>

<Story
  name="Default"
  args={{
    type: "image",
    specs: {
      image: writable({
        idColumn: "id",
        filesPath:
          "https://picsum.photos/",
        dataType: SymphonyDataType.IMAGE,
      }),
      audio: writable({
        idColumn: "id",
        filesPath: "",
        dataType: SymphonyDataType.AUDIO,
      }),
      tabular: writable({
        idColumn: "id",
        dataType: SymphonyDataType.TABULAR,
      }),
    },
    tooltips: {
      image: writable({
        hover: true,
        mousePos: { x: 0, y: 0 },
        filesPath:
          "https://picsum.photos/",
        number: 941,
        instance: {
          id: "/200?random=1",
          foo: "test",
          bar: "test",
          numbervalue: 941,
          list: [9,4,1],
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
          foo: "test",
          bar: "test",
          numbervalue: 941,
          list: [9,4,1],
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
