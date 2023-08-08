// For licensing see accompanying LICENSE file.
// Copyright (C) 2023 Apple Inc. All Rights Reserved.

import type {
  SymphonySpec,
  WidgetWritable,
  TooltipSpec,
  WidgetSpec,
  SummaryWidgetSpec,
} from "./types";
import type { DOMWidgetModel } from "@jupyter-widgets/base";
import type { Readable, Updater } from "svelte/store";
import type ColumnTable from "arquero/dist/types/table/column-table";

import { fromArrow, op } from "arquero";
import { derived, Writable } from "svelte/store";
import { writable } from "svelte/store";
import { cartesian } from "./helpers/table";

export function widgetWritable<T>(name_: string, value_: T): WidgetWritable<T> {
  const name: string = name_;
  const curVal: Writable<T> = writable(value_);
  let model: DOMWidgetModel;

  return {
    set: (v: T) => {
      curVal.set(v);
      if (model) {
        model.set(name, v);
        model.save_changes();
      }
    },
    setModel: (m: DOMWidgetModel) => {
      model = m;
      curVal.set(model.get(name));
      model.on("change:" + name, () => curVal.set(model.get(name)), null);
    },
    subscribe: curVal.subscribe,
    update: (func: Updater<T>) => {
      curVal.update((v: T) => {
        const out = func(v);
        // TODO: figure out why spread operator isn't enough to update model.
        if (model) {
          model.set(name, "");
          model.set(name, out);
          model.save_changes();
        }
        return out;
      });
    },
  };
}

export const symphonySpec = widgetWritable<SymphonySpec>(
  "symphony_spec",
  {} as SymphonySpec
);
export const widgetSpecs = widgetWritable<
  Record<string, WidgetSpec | SummaryWidgetSpec>
>("widgetSpecs", {});
export const dataTable = widgetWritable<DataView>(
  "table",
  new DataView(new ArrayBuffer(0))
);
export const selected = widgetWritable<string[]>("selected", []);
export const groupColumns = widgetWritable<string[]>("group_columns", []);
export const filter = widgetWritable<string>("filter", "");
export const filterError = widgetWritable<string>("filter_error", "");
export const tooltip = widgetWritable<TooltipSpec>("tooltip", {
  hover: false,
  mousePos: { x: 0, y: 0 },
  fetchPrefix: "",
  instance: undefined,
  number: 0,
});

export const table: Readable<ColumnTable> = derived(dataTable, (d: DataView) =>
  fromArrow(d)
);
export const filteredTable: Readable<ColumnTable> = derived(
  [table, filter],
  ([table, filter]) => {
    filterError.set("");
    let filteredTable = table;
    if (filter) {
      try {
        filteredTable = filteredTable.filter(filter);
      } catch (err) {
        filterError.set(err as string);
      }
    }
    return filteredTable;
  }
);
export const groupNames: Readable<string[] | string[][]> = derived(
  [filteredTable, groupColumns],
  ([filteredTable, groupColumns]) => {
    if (groupColumns.length > 0) {
      const uniqueColumnValues: string[][] = groupColumns.map(
        (col) =>
          (
            filteredTable
              .rollup({ col: op.array_agg_distinct(col) })
              .object() as any
          ).col
      );
      // If just one column, don't do cartesian product and make it a 2D array.
      if (uniqueColumnValues.length === 1) {
        return uniqueColumnValues[0].map((group) => [group]);
      }
      return cartesian(...uniqueColumnValues);
    } else return [];
  }
);
export const groupedTables: Readable<ColumnTable[]> = derived(
  [filteredTable, groupColumns, groupNames, symphonySpec],
  ([filteredTable, groupColumns, groupNames, symphonySpec]) => {
    if (
      groupColumns !== undefined &&
      filteredTable !== undefined &&
      groupNames !== undefined &&
      groupColumns.length > 0 &&
      groupNames.length > 0
    ) {
      let groupedTable = filteredTable.groupby(...groupColumns);
      let partitions = groupedTable.partitions();

      let groupedTables: ColumnTable[] = partitions.map((partition) =>
        filteredTable.reify(partition)
      );
      return groupedTables;
    } else {
      return [];
    }
  }
);

export function initializeStores(model: DOMWidgetModel): void {
  selected.setModel(model);
  filter.setModel(model);
  groupColumns.setModel(model);
  symphonySpec.setModel(model);
  dataTable.setModel(model);
}
