import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Loading from "./Loading";

function Showcase() {
  const [currentImage, setCurrentImage] = useState<string>();
  const [images, setImages] = useState<string[]>();
  const [index, setIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchShowcaseImages = async () => {
    const res = await fetch("/api/showcase/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const { urlList, message }: { urlList: string[]; message: string } =
        await res.json();
      console.log(urlList.length);
      if (urlList) {
        setImages(urlList);
        const maxIndex = urlList.length;
        setMaxIndex(maxIndex);
        setCurrentImage(urlList[index]);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchShowcaseImages();
  }, []);
  useEffect(() => {
    if (images) {
      setCurrentImage(images[index]);
    }
  }, [index]);
  return (
    <>
      {isLoading ? (
        <div className="skeleton h-64 w-full"></div>
      ) : (
        <>
          <div className="carousel w-full">
            <div className="carousel-item relative w-full h-64">
              <div className="flex flex-row w-full items-center justify-center">
                <img src={currentImage} className=" image-full" />
              </div>
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
          <div className="flex w-full justify-center gap-2 py-2">
            <div role="tablist" className="tabs tabs-bordered"></div>
            {images?.map((image, ind) => (
              <span
                key={`showcaseIndex-${ind}`}
                className={
                  `btn btn-xs btn-circle ` +
                  (index === ind ? `btn-neutral` : ``)
                }
                onClick={() => setIndex(ind)}
              >
                {ind + 1}
              </span>
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default Showcase;
