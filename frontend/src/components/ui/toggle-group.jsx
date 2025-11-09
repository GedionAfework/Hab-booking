import React, { useState } from "react";

export const ToggleGroup = ({ type = "single", defaultValue, value, onValueChange, children }) => {
  const isControlled = value !== undefined;
  const [selected, setSelected] = useState(defaultValue || (type === "multiple" ? [] : null));
  const currentValue = isControlled ? value : selected;

  const toggle = (next) => {
    if (type === "single") {
      const finalValue = currentValue === next ? null : next;
      if (!isControlled) setSelected(finalValue);
      onValueChange?.(finalValue);
    } else {
      const set = new Set(currentValue || []);
      if (set.has(next)) set.delete(next);
      else set.add(next);
      const finalValue = Array.from(set);
      if (!isControlled) setSelected(finalValue);
      onValueChange?.(finalValue);
    }
  };

  return React.Children.map(children, (child) =>
    React.cloneElement(child, {
      pressed: type === "single" ? currentValue === child.props.value : currentValue?.includes(child.props.value),
      onPressedChange: () => toggle(child.props.value),
    })
  );
};
