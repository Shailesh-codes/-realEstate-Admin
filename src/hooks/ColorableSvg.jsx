// ColorableSvg.jsx
import React from 'react';

const ColorableSvg = ({
  children,
  color = 'currentColor',
  width,
  height,
  className = '',
  ...props
}) => {
  const modifySvgChildren = (element) => {
    if (!React.isValidElement(element)) {
      return element;
    }

    const newProps = { ...element.props };

    if (newProps.stroke === 'currentColor') {
      newProps.stroke = color;
    }
    if (newProps.fill === 'currentColor') {
      newProps.fill = color;
    }

    if (newProps.children) {
      newProps.children = React.Children.map(newProps.children, modifySvgChildren);
    }

    return React.cloneElement(element, newProps);
  };

  const svgElement = React.Children.only(children);
  
  const modifiedSvg = React.cloneElement(
    modifySvgChildren(svgElement),
    {
      ...props,
      className,
      ...(width && { width }),
      ...(height && { height }),
    }
  );

  return modifiedSvg;
};

export default ColorableSvg;