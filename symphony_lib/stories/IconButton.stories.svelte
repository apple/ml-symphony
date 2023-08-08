<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import IconButton from "../src/elements/IconButton.svelte";
  import "./utils.css";
</script>

<Meta
  title="IconButton"
  component={IconButton}
  argTypes={{
    filled: { control: "boolean" },
  }}
/>

<Template let:args>
  <IconButton {...args}>
    <div slot="icon">
      <span>An IconButton can hold an icon via a slot named </span>
      <code>icon</code>
      <span>.</span>
    </div>
    <div slot="text">
      <span>And text with a slot named</span>
      <code>text</code>
      <span>.</span>
    </div>
  </IconButton>
  <IconButton {...args}>
    <div slot="icon">
      <span>icon</span>
    </div>
    <div slot="text">
      <span>text</span>
    </div>
  </IconButton>
</Template>

<Story
  name="Default"
  args={{
    filled: false,
  }}
/>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
