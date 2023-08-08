<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  import type { ConfusionMatrixEntry } from '@apple/symphony-lib';

  import { interpolateBlues, interpolateReds } from 'd3-scale-chromatic';

  export let scores: ConfusionMatrixEntry;
  export let predictionColumn: string;
  export let labelColumn: string;
  export let groupName: string[] = [''];
</script>

<table class="w-max m-5">
  <tbody>
    <tr>
      <td class="text-center font-bold" colspan="2"
        >{groupName}<br />{((100 * scores.acc) / scores.size).toFixed(2)}%
        accuracy</td
      >
      <td class="border p-5 text-center" colspan="2"
        >Prediction <br />
        <span class="italic">column: {predictionColumn}</span></td
      >
    </tr>
    <tr>
      <td />
      <td />
      <td class="border p-3 text-center">1</td>
      <td class="border p-3 text-center">0</td>
    </tr>
    <tr>
      <td class="border p-5 text-center" rowspan="2"
        >Label <br />
        <span class="italic">column: {labelColumn}</span></td
      >
      <td class="border p-3 text-center pl-6 pr-6">1</td>
      <td
        style="background: {interpolateBlues((scores.tp / scores.size) * 0.75)}"
        class="border p-5 pl-8 pr-8">{scores.tp}</td
      >
      <td
        style="background: {interpolateReds((scores.fn / scores.size) * 0.75)}"
        class="border p-5 pl-8 pr-8">{scores.fn}</td
      >
    </tr>
    <tr>
      <td class="border p-3 text-center pl-6 pr-6">0</td>
      <td
        style="background: {interpolateReds((scores.fp / scores.size) * 0.75)}"
        class="border p-5 pl-8 pr-8">{scores.fp}</td
      >
      <td
        style="background: {interpolateBlues((scores.tn / scores.size) * 0.75)}"
        class="border p-5 pl-8 pr-8">{scores.tn}</td
      >
    </tr>
  </tbody>
</table>
