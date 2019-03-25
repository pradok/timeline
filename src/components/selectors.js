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

export const getItems = (items, unitsPerPixel) => {
  let prevVerticalSpace = 0;
  let totalHeight = 0;
  let currentMaxWidth = 0;
  const maxWidth = MAX_ITEM_TEXT_WIDTH + BULLET_WIDTH_INCLUDING_MARGIN;
  const records = items.sortBy(r => r.get('value')).valueSeq().map(e => {
    const size = calcTextSize(e.get('label'), maxWidth);
    const {width, height} = size;
    let top;
    let left = valueToPixel(e.get('value'), unitsPerPixel);

    if (left < currentMaxWidth) {
      top = prevVerticalSpace;
    } else {
      top = 0;
      currentMaxWidth = 0;
    }

    totalHeight += height;
    prevVerticalSpace = prevVerticalSpace + height + (2.5 * VERTICAL_ITEM_SPACING);
    if (left > currentMaxWidth) {
      currentMaxWidth = width + left;
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
