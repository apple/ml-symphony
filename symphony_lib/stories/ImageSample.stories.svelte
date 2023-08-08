<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import ImageSample from "../src/elements/ImageSample.svelte";
  import { writable } from "svelte/store";
  import "./utils.css";
</script>

<Meta title="ImageSample" component={ImageSample} argTypes={{}} />

<Template let:args>
  <div>
    <ImageSample {...args} />
  </div>
</Template>

<Story
  name="Default"
  args={{
    id: "/200?random=1",
    symphonySpec: writable({
      id_column: "id",
      filesPath: "https://picsum.photos/",
    }),
    large: false,
  }}
/>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
