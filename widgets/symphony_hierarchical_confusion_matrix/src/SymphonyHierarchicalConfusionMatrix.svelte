<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  import type { ClassificationSpec } from '@apple/symphony-lib';
  import type { Readable } from 'svelte/store';
  import type ColumnTable from 'arquero/dist/types/table/column-table';

  import * as confMat from '@apple/hierarchical-confusion-matrix';
  import '@apple/hierarchical-confusion-matrix/package/style.css';

  import { mapHeight, ComponentHeader } from '@apple/symphony-lib';

  export let filteredTable: Readable<ColumnTable>;
  export let widgetSpec: ClassificationSpec;
  export let fullSize: boolean = false;

  let predictionColumn = widgetSpec.predictionColumn
    ? widgetSpec.predictionColumn
    : $filteredTable.columnName(0);
  let labelColumn = widgetSpec.labelColumn
    ? widgetSpec.labelColumn
    : $filteredTable.columnName(0);
  let matrixDiv: HTMLDivElement | undefined = undefined;
  const spec = {
    classes: ['root'],
  };

  $: confusions = $filteredTable
    .groupby(labelColumn, predictionColumn)
    .count()
    .objects()
    .map((ent) => ({
      actual: ['root:' + ent[labelColumn]],
      observed: ['root:' + ent[predictionColumn]],
      count: ent.count,
    }));
  $: if (matrixDiv !== undefined && confusions !== undefined) {
    matrixDiv.innerHTML = '';
    confMat.embedElement(matrixDiv, spec, confusions);
  }
</script>

<div
  class="flex flex-col p-2 {fullSize ? 'h-full' : mapHeight(widgetSpec.height)}"
>
  <ComponentHeader
    title={'Hierarchical Confusion Matrix'}
    description={widgetSpec.description}
    container={matrixDiv}
  />
  <div bind:this={matrixDiv} class="overflow-auto" />
</div>
