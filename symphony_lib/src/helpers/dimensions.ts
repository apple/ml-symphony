// For licensing see accompanying LICENSE file.
// Copyright (C) 2023 Apple Inc. All Rights Reserved.

export function mapWidth(width: string): string {
  switch (width) {
    case 'XS':
      return 'col-span-1';
    case 'S':
      return 'col-span-2';
    case 'M':
      return 'col-span-3';
    case 'L':
      return 'col-span-4';
    case 'XL':
      return 'col-span-5';
    case 'XXL':
      return 'col-span-6';
    default:
      return 'col-span-2';
  }
}

export function mapHeight(height: string, grid = false): string {
  switch (height) {
    case 'XS':
      return grid ? 'row-span-1' : 'max-h-XS';
    case 'S':
      return grid ? 'row-span-2' : 'max-h-S';
    case 'M':
      return grid ? 'row-span-3' : 'max-h-M';
    case 'L':
      return grid ? 'row-span-4' : 'max-h-L';
    case 'XL':
      return grid ? 'row-span-5' : 'max-h-XL';
    case 'XXL':
      return grid ? 'row-span-6' : 'max-h-XXL';
    default:
      return grid ? 'row-span-2' : 'max-h-S';
  }
}

export function mapHeightFixed(height: string, grid = false): string {
  switch (height) {
    case 'XS':
      return grid ? 'row-span-1' : 'h-XS';
    case 'S':
      return grid ? 'row-span-2' : 'h-S';
    case 'M':
      return grid ? 'row-span-3' : 'h-M';
    case 'L':
      return grid ? 'row-span-4' : 'h-L';
    case 'XL':
      return grid ? 'row-span-5' : 'h-XL';
    case 'XXL':
      return grid ? 'row-span-6' : 'h-XXL';
    default:
      return grid ? 'row-span-2' : 'h-S';
  }
}
