<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import Heading from "../src/elements/Heading.svelte";
  import "./utils.css";
</script>

<Meta
  title="Heading"
  component={Heading}
  argTypes={{
    heading: { control: "text" },
    description: { control: "text" },
  }}
/>

<Template let:args>
  <Heading {...args} />
</Template>

<Story
  name="Default"
  args={{
    heading: "Heading",
    description:
      "The description holds information about the component the heading belongs to.",
  }}
/>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
