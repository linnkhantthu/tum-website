import { makeid } from "@/lib/utils-fe";
import React, { useEffect, useState } from "react";

function Showcase() {
  const [currentImage, setCurrentImage] = useState<{
    id: string;
    url: string;
  }>();
  const [images, setImages] = useState<
    {
      id: string;
      url: string;
    }[]
  >();
  const [index, setIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  useEffect(() => {
    // Fetch Image Links
    const images = [
      {
        id: makeid(10),
        url: "https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp",
      },
      {
        id: makeid(10),
        url: "https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp",
      },
      {
        id: makeid(10),
        url: "https://img.daisyui.com/images/stock/photo-1414694762283-acccc27bca85.webp",
      },
      {
        id: makeid(10),
        url: "https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp",
      },
    ];
    setImages(images);
    const maxIndex = images.length;
    setMaxIndex(maxIndex);
    setCurrentImage(images[index]);
  }, []);
  useEffect(() => {
    if (images) {
      setCurrentImage(images[index]);
    }
  }, [index]);
  return (
    <div className="carousel w-full">
      <div id={currentImage?.id} className="carousel-item relative w-full">
        <img src={currentImage?.url} className="w-full" />
        <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
          <a
            className="btn btn-circle"
            onClick={() => {
              setIndex(index > 0 ? index - 1 : index);
            }}
          >
            ❮
          </a>
          <a
            className="btn btn-circle"
            onClick={() => {
              setIndex(index < maxIndex - 1 ? index + 1 : index);
            }}
          >
            ❯
          </a>
        </div>
      </div>
    </div>
  );
}

export default Showcase;
