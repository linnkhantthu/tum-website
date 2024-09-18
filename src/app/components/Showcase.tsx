"use client";
import useUser from "@/lib/useUser";
import React, { useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import Loading from "./Loading";

function Showcase() {
  const [currentImage, setCurrentImage] = useState<string>();
  const [images, setImages] = useState<string[]>();
  const [index, setIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoading: isUserLoading, isError, data } = useUser();

  /**
   * Fetch Images for showcase
   */
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

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = (e.target as HTMLInputElement).files;

    if (files && files.length > 0) {
      const file = files[0];
      const formData = new FormData();
      formData.append("image", file);
      try {
        const res = await fetch("/api/showcase/", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const { url }: { url: string } = await res.json();
          setImages([...images!, url]);
          setMaxIndex(maxIndex + 1);
          setCurrentImage(url);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const deleteImage = async () => {
    const filename = currentImage?.split("%2F")[1].split("?")[0];
    try {
      const res = await fetch("/api/showcase/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filename: filename }),
      });
      if (res.ok) {
        const { success }: { success: boolean } = await res.json();
        console.log(success);
        if (success) {
          const updatedImages = images?.filter(
            (image) => image !== currentImage
          );
          console.log(updatedImages);
          setMaxIndex(updatedImages?.length || 0);
          console.log(index);
          setIndex(index === 0 ? index + 1 : index - 1);
          setImages(updatedImages);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const filename = currentImage?.split("%2F")[1].split("?")[0];
    const files = (e.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      const file = files[0];
      // FormData
      const formData = new FormData();
      formData.append("image", file);
      formData.append("filename", filename!);
      try {
        const res = await fetch("/api/showcase/", {
          method: "PUT",
          body: formData,
        });
        if (res.ok) {
          const { url }: { url: string } = await res.json();
          if (url) {
            setCurrentImage(url);
            setImages(
              images?.map((image) => (image === currentImage ? url : image))
            );
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <>
      {isLoading ? (
        <div className="skeleton h-64 w-full"></div>
      ) : (
        <>
          <div className="carousel w-full border rounded border-neutral">
            <div className="carousel-item relative w-full h-64">
              <div className="flex flex-row w-full items-center justify-center">
                {currentImage ? (
                  <div className="flex flex-row w-full justify-center">
                    <img src={currentImage} className="image-full h-64" />

                    {/* Admin Controls */}
                    {isUserLoading ? (
                      <Loading />
                    ) : isError ? (
                      "Failed to check user session"
                    ) : data.user?.role === "ADMIN" ? (
                      <div className="flex flex-row w-full absolute justify-end gap-1 p-1">
                        <div className="flex flex-row">
                          <input
                            type="file"
                            className="file-input file-input-bordered file-input-xs w-full max-w-xs"
                            onChange={updateImage}
                          />
                        </div>
                        <button
                          className="btn btn-xs btn-error"
                          onClick={deleteImage}
                        >
                          <MdDelete />
                        </button>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                ) : isUserLoading ? (
                  <Loading />
                ) : isError ? (
                  "Falied to check user session"
                ) : data.user?.role === "ADMIN" ? (
                  <div className="absolute z-10">
                    <label className="form-control w-full max-w-xs">
                      <div className="label">
                        <span className="label-text">Upload</span>
                      </div>
                      <input
                        type="file"
                        className="file-input file-input-sm file-input-bordered w-full max-w-xs"
                        onChange={upload}
                      />
                    </label>
                  </div>
                ) : (
                  ""
                )}
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
                    const maxInd =
                      data.user?.role === "ADMIN" ? maxIndex : maxIndex - 1;
                    setIndex(index < maxInd ? index + 1 : index);
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
