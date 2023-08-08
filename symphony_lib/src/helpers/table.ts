// For licensing see accompanying LICENSE file.
// Copyright (C) 2023 Apple Inc. All Rights Reserved.

import type ColumnTable from "arquero/dist/types/table/column-table";

const UNIQUE_COLS_PCTG = 0.1;

export function getColumnType(
  table: ColumnTable,
  columnName: string
): string | undefined {
  const col = table.column(columnName);
  if (col === undefined) {
    return undefined;
  }
  const firstValue = col.get(0);
  if (firstValue.constructor.name === "SignedBigNum") {
    return "number";
  }
  if (typeof firstValue === "object") {
    const objectClass: string = firstValue.constructor.name;
    if (objectClass.includes("Array")) {
      return "array";
    }
  }
  return typeof firstValue;
}

export function getBinnableStringColumns(table: ColumnTable): string[] {
  const colNames = table.columnNames();
  const binnnableStringColumns: string[] = [];
  for (const colName of colNames) {
    const columnType = getColumnType(table, colName);
    if (columnType === "string") {
      if (isStringColumnBinnable(colName, table)) {
        binnnableStringColumns.push(colName);
      }
    }
  }
  return binnnableStringColumns;
}

export function isStringColumnBinnable(
  columnName: string,
  table: ColumnTable
): boolean {
  /** If more than UNIQUE_COLS_PCTG percent of the column are unique strings, likely an ID, don't bin. */
  const unique = table.groupby(columnName).count().numRows();
  if (unique < UNIQUE_COLS_PCTG * table.numRows()) {
    return true;
  }
  return false;
}

export const cartesian = (...a: string[][]): string[] =>
  a.reduce((a, b) =>
    a.flatMap((d) =>
      b.map((e: any) => [d, e].reduce((acc, val) => acc.concat(val), []))
    )
  );
