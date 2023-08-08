<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import SubHeading from "../src/elements/SubHeading.svelte";
  import "./utils.css";
</script>

<Meta
  title="SubHeading"
  component={SubHeading}
  argTypes={{
    heading: { control: "text" },
  }}
/>

<Template let:args>
  <SubHeading {...args} />
</Template>

<Story
  name="Default"
  args={{
    heading: "test",
  }}
/>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
