// ColorableSvg.jsx
import React, { ReactElement, ReactNode } from 'react';

interface ColorableSvgProps {
  children: ReactNode;
  color?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  [key: string]: any; // for additional props
}

const ColorableSvg = ({
  children,
  color = 'currentColor',
  width,
  height,
  className = '',
  ...props
}: ColorableSvgProps) => {
  const modifySvgChildren = (element: ReactNode): ReactNode => {
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

    return React.cloneElement(element as ReactElement, newProps);
  };

  const svgElement = React.Children.only(children) as ReactElement;
  
  const modifiedSvg = React.cloneElement(
    modifySvgChildren(svgElement) as ReactElement,
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