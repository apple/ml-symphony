<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import NumberInput from "../src/elements/NumberInput.svelte";
  import "./utils.css";
</script>

<Meta
  title="NumberInput"
  component={NumberInput}
  argTypes={{
    title: { control: "text" },
    value: { control: "number" },
  }}
/>

<Template let:args>
  <NumberInput {...args} />
</Template>

<Story
  name="Default"
  args={{
    title: "test",
    value: 100,
  }}
/>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
