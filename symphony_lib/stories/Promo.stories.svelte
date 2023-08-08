<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import Promo from "../src/elements/Promo.svelte";
  import "./utils.css";
</script>

<Meta title="Promo" component={Promo} argTypes={{}} />

<Template let:args>
  <Promo {...args} />
</Template>

<Story name="Default" args={{}} />

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
