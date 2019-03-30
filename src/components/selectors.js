import {createSelector} from "reselect";
import {
  MIN_HEADER_TICK_SPACING,
  MAX_ITEM_TEXT_WIDTH,
  BULLET_WIDTH_INCLUDING_MARGIN,
  VERTICAL_ITEM_SPACING,
  ITEM_X_PADDING
} from "../constants";

// Task 1 - you may need some of these additional imports...
import calcTextSize from "../utils/calcTextSize";
import immutableRecords from "../types/immutableRecords";
import {List} from "immutable";
// ... plus additional values from constants

// Convert from a number line value to a pixel location
export const valueToPixel = (value, unitsPerPixel) => {
  return value / unitsPerPixel;
};

// Convert from a pixel location to a number line value
export const pixelToValue = (pixel, unitsPerPixel) => pixel * unitsPerPixel;
const getAllItems = state => state.getIn(['items']).sortBy(r => r.getIn(['value'])).valueSeq();
const getUnitsPerPixel = state => state.unitsPerPixel;
const getMaxWidth = () => MAX_ITEM_TEXT_WIDTH + BULLET_WIDTH_INCLUDING_MARGIN;
const getMinHeaderTickSpacing = () => MIN_HEADER_TICK_SPACING;

export const computedItemsReduce = (items, unitsPerPixel, maxWidth = getMaxWidth()) => {
  const records = items.reduce((acc, current) => {
      const size = calcTextSize(current.getIn(['label']), maxWidth);
      let height = size.height + (2 * VERTICAL_ITEM_SPACING);
      let width = size.width + (3 * ITEM_X_PADDING);
      let top;
      let left = valueToPixel(current.getIn(['value']), unitsPerPixel);

      if (left < acc.prev.currentMaxWidth) {
        top = acc.prev.prevVerticalSpace;
      } else {
        top = 0;
        acc.prev.prevVerticalSpace = 0;
        acc.prev.currentMaxWidth = maxWidth + left;
      }

      acc.prev.prevVerticalSpace = acc.prev.prevVerticalSpace + height;
      if (acc.prev.prevVerticalSpace > acc.prev.totalHeight) {
        acc.prev.totalHeight = acc.prev.prevVerticalSpace;
      }

      const computedRecord = immutableRecords.ItemDisplayRecord({
        id: current.getIn(['id']),
        label: current.getIn(['label']),
        value: current.getIn(['value']),
        width: width,
        height,
        left,
        top
      });
      acc.list.push(computedRecord);
      return acc;
    },
    {
      prev: {
        prevVerticalSpace: 0,
        totalHeight: 0,
        currentMaxWidth: 0
      },
      list: []
    }
  );
  records.list = List(records.list);
  return {
    items: records.list,
    totalHeight: records.prev.totalHeight
  };
};

export const getItemsSelector = createSelector(
  [getAllItems, getUnitsPerPixel, getMaxWidth],
  (items, unitsPerPixel, maxWidth) => computedItemsReduce(items, unitsPerPixel, maxWidth)
);

export const getHeaderTickSpacingSelector = createSelector(
  [getUnitsPerPixel, getMinHeaderTickSpacing],
  (unitsPerPixel, minHeaderTickSpacing) => getHeaderTickSpacing(unitsPerPixel, minHeaderTickSpacing)
);

// Calculate the spacing for tick marks along the header.
// You do not need to modify this function.
export const getHeaderTickSpacing = (unitsPerPixel, minHeaderTickSpacing) => {
  const minSpacing = minHeaderTickSpacing * unitsPerPixel;
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
