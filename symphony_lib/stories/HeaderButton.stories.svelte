<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import HeaderButton from "../src/elements/HeaderButton.svelte";
  import "./utils.css";
</script>

<Meta
  title="HeaderButton"
  component={HeaderButton}
  argTypes={{
    value: { control: "text" },
    selected: { control: "boolean" },
  }}
/>

This is meant to be rendered on black background. Thus, we put it in a black div
with padding.
<br />
<div class="p-4 bg-black">
  <Template let:args>
    <HeaderButton {...args} />
  </Template>
</div>

<Story
  name="Default"
  args={{
    selected: false,
    value: "test",
  }}
/>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
