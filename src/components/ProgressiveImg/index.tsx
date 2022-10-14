import React, { useState, useEffect } from "react";
import './index.less'
const ProgressiveImg = ({ placeholderSrc, src, ...props }) => {
  const [imgSrc, setImgSrc] = useState(placeholderSrc || src);
  const customClass:any = placeholderSrc && imgSrc === placeholderSrc ? "loading" : "loaded";
  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImgSrc(src);
    };
  }, [src]);

  return (
    <img
      {...{ src: imgSrc, ...props }}
      alt={props.alt || ""}
      className={`image ${customClass} ${props?.className ?? ''}`}
    />
  );
};
export default ProgressiveImg;
