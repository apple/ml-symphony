// For licensing see accompanying LICENSE file.
// Copyright (C) 2023 Apple Inc. All Rights Reserved.

// import { op } from 'arquero';
import type ColumnTable from 'arquero/dist/types/table/column-table';

export function getUniqueValuesForStringColumnForFamiliarity(
  split: boolean,
  familiarityColumn: string,
  columnName: string,
  table: ColumnTable
): string[] {
    if (split) {
      // Tf splitting familiarity

      // DNI Kit doesn't compute for classes with less than 50 data points (by default)
      // Filter out these less than 50 data point classes 
      let tempFamilarityPoint = table.get(familiarityColumn, 0) // get first familarity point, get classes from it's columns
      let familarityClassesList = Object.keys(tempFamilarityPoint)
      return familarityClassesList as string[];
  } else {
    // if not splitting familiarity, default on load
    
    const unique = table.groupby(columnName).count();
    return unique.array(columnName) as string[];
  }
}

export function getSplitTable(
  columnValue: string,
  familiarityColumn: string,
  column: string,
  table: ColumnTable
): ColumnTable {
  let resultTable = table;
  resultTable = resultTable.derive({
    selectedFamiliarity: `d.${familiarityColumn}['${columnValue}']`,
  });
  // This only works for columns that contain one string for a metadata class.
  resultTable = resultTable.filter(`d.${column} == "${columnValue}"`);
  return resultTable;
}

export function getSplitTables(
  columnValue: string,
  familiarityColumn: string,
  column: string,
  tables: ColumnTable[]
): ColumnTable[] {
  return tables.map((table) => {
    return getSplitTable(columnValue, familiarityColumn, column, table);
  });
}
