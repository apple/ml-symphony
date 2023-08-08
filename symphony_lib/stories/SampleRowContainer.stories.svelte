<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import SampleRowContainer from "../src/elements/SampleRowContainer.svelte";
  import { writable } from "svelte/store";
  import "./utils.css";
  import { SymphonyDataType } from "../src/types";
  import AudioSample from "../static/symphony-audio-sample.mp3"
</script>

<Meta
  title="SampleRowContainer"
  component={SampleRowContainer}
  argTypes={{
    type: {
      control: { type: "select", options: ["image", "audio", "tabular"] },
    },
  }}
/>

<Template let:args>
  <SampleRowContainer
    dataPoints={args.dataPoints[args.type]}
    selected={args.selected}
    symphonySpec={args.specs[args.type]}
    tooltip={args.tooltips[args.type]}
  />
</Template>

<Story
  name="Default"
  args={{
    type: "image",
    dataPoints: {
      image: [
        {
          id: "/200?random=1",
        },
        {
          id: "/200?random=2",
        },
        {
          id: "/200?random=3",
        },
        {
          id: "/200?random=4",
        },
        {
          id: "/200?random=5",
        },
        {
          id: "/200?random=6",
        },
        {
          id: "/200?random=7",
        },
        {
          id: "/200?random=8",
        },
        {
          id: "/200?random=9",
        },
        {
          id: "/200?random=10",
        }
      ],
      audio: [
        {
          id: AudioSample
        },
        {
          id: AudioSample
        },
        {
          id: AudioSample
        },
      ],
      tabular: [
        { id: "row1" },
        { id: "row2" },
        { id: "row3" },
        { id: "row4" },
        { id: "row5" },
        { id: "row6" },
        { id: "row7" },
      ],
    },
    selected: writable([]),
    specs: {
      image: writable({
        idColumn: "id",
        dataType: SymphonyDataType.IMAGE,
        filesPath:
          "https://picsum.photos/",
      }),
      audio: writable({
        idColumn: "id",
        dataType: SymphonyDataType.AUDIO,
        filesPath: "",
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
        fetchPrefix:
          "https://picsum.photos/",
        number: 100,
        instance: {
          id: "/200?random=1",
        },
      }),
      audio: writable({
        hover: true,
        mousePos: { x: 0, y: 0 },
        filesPath: "",
        number: 100,
        instance: {
          id: AudioSample
        },
      }),
      tabular: writable({
        hover: true,
        mousePos: { x: 0, y: 0 },
        number: 100,
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
