import {
  MIN_HEADER_TICK_SPACING,
  MAX_ITEM_TEXT_WIDTH,
  BULLET_WIDTH_INCLUDING_MARGIN,
  VERTICAL_ITEM_SPACING
} from "../constants";

// Task 1 - you may need some of these additional imports...
import calcTextSize from "../utils/calcTextSize";
import immutableRecords from "../types/immutableRecords";
import {List} from "immutable";
// ... plus additional values from constants

// Convert from a number line value to a pixel location
export const valueToPixel = (value, unitsPerPixel) => value / unitsPerPixel;

// Convert from a pixel location to a number line value
export const pixelToValue = (pixel, unitsPerPixel) => pixel * unitsPerPixel;

export const getItems = (items, unitsPerPixel, tickSpacing) => {
  let prevSize = {};
  let prevLeft;
  let totalHeight = 0;
  let combinedWidth = 0;
  let combinedHeight = 0;
  let currentMaxWidth = 0;
  const maxWidth = MAX_ITEM_TEXT_WIDTH + BULLET_WIDTH_INCLUDING_MARGIN;
  const records = items.sortBy(r => r.get('value')).valueSeq().map(e => {
    const size = calcTextSize(e.get('label'), maxWidth);
    const {width, height} = size;
    let top;
    let left = valueToPixel(e.get('value'), unitsPerPixel);
    if (prevLeft > 0 && left - prevLeft > 3 * MIN_HEADER_TICK_SPACING) {
      combinedWidth = 0;
    }
    if (combinedWidth > 0) {
      if (width < currentMaxWidth) {
        combinedWidth = (combinedWidth - width) + combinedWidth;
        top = combinedHeight + height;
        combinedHeight = height <= prevSize.height ? combinedHeight + prevSize.height : combinedHeight + prevSize.height + height;
      } else {
        console.log('value:', e.get('value'));
        combinedWidth = width;
        combinedHeight = height;
        top = 0;
        currentMaxWidth = 0;
      }
    } else {
      combinedWidth = width;
      combinedHeight = height;
      top = 0;
      currentMaxWidth = 0;
    }
    totalHeight += height;
    prevSize = size;
    combinedHeight += VERTICAL_ITEM_SPACING;
    prevLeft = left;
    if (width > currentMaxWidth) {
      currentMaxWidth = width;
    }

    return immutableRecords.ItemDisplayRecord({
      id: e.get('id'),
      label: e.get('label'),
      value: e.get('value'),
      width,
      height,
      left,
      top
    });
  });
  return {
    items: List(records),
    totalHeight
  };
};

// Calculate the spacing for tick marks along the header.
// You do not need to modify this function.
export const getHeaderTickSpacing = (unitsPerPixel) => {
  const minSpacing = MIN_HEADER_TICK_SPACING * unitsPerPixel;
  let selectedSpacing = 1;
  while (selectedSpacing < minSpacing) {
    selectedSpacing *= 2;
    if (selectedSpacing >= minSpacing) {
      break;
    }
    selectedSpacing = selectedSpacing * 5 / 2;
    if (selectedSpacing >= minSpacing) {
      break;
    }
    selectedSpacing *= 2;
  }
  return selectedSpacing;
};
