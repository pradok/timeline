import React from "react";
import PropTypes from "prop-types";
import { BULLET_LEFT_OFFSET, ITEM_X_PADDING } from "../constants";

// Draws a bullet and text label with the specified position and size.
// Position is adjusted slightly so that the bullet lines up exactly
// on the specified x position.
const NumberLineItem = props => {
  const style = {
    left: props.left + BULLET_LEFT_OFFSET - ITEM_X_PADDING,
    top: props.top,
    width: props.width
  };

  const onClickHandler = () => {
    props.onClickHandler(props.id);
  }

  return (
    <div className="numberLineItem" style={style} onClick={onClickHandler}>
      <div className="numberLineItemBullet" />
        <span>{props.label}</span>
    </div>
  );
};

NumberLineItem.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  top: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  onClickHandler: PropTypes.func.isRequired
};

export default NumberLineItem;
