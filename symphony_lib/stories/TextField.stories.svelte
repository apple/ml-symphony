<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import TextField from "../src/elements/TextField.svelte";
  import "./utils.css";
</script>

<Meta
  title="TextField"
  component={TextField}
  argTypes={{
    value: { control: "text" },
    placeholder: { control: "text" },
  }}
/>

<Template let:args>
  <TextField {...args} />
</Template>

<Story
  name="Default"
  args={{
    value: "test",
    placeholder: "placeholder",
  }}
/>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
