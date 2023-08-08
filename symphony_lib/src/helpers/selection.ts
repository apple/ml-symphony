// For licensing see accompanying LICENSE file.
// Copyright (C) 2023 Apple Inc. All Rights Reserved.

import { get, Writable } from "svelte/store";

export function selectAll(
  selectedStore: Writable<string[]>,
  newSelected: string[]
) {
  let existingSelectedSet = new Set(get(selectedStore));
  let newSelectedSet = new Set(newSelected);

  if (setHasAll(newSelectedSet, existingSelectedSet)) {
    for (var toRemove of newSelectedSet) existingSelectedSet.delete(toRemove);
    selectedStore.update(() => [...existingSelectedSet]);
    return;
  }

  let combinedSelected = new Set([...existingSelectedSet, ...newSelectedSet]);
  selectedStore.set(Array.from(combinedSelected));
}

function setHasAll(set: Set<unknown>, setHas: Set<unknown>) {
  for (var a of set) if (!setHas.has(a)) return false;
  return true;
}
