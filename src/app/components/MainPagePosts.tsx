import React from "react";

function MainPageArticles({
  image,
  title,
  content,
}: {
  image: any;
  title: string;
  content: string;
}) {
  const dummy = {
    time: 1722928250147,
    blocks: [
      {
        id: "WsEa9q_kUD",
        data: {
          file: {
            url: "http://localhost:3000/images/5b45916dcaabb90ddf45669a9334319f.jpg",
          },
          caption: "Photo of Technological University, Mandalay",
          stretched: false,
          withBorder: false,
          withBackground: false,
        },
        type: "image",
      },
      {
        id: "1G7wXIXJaJ",
        data: { text: "Technological University, Mandalay", level: 1 },
        type: "header",
      },
      {
        id: "i0Icj9k-oW",
        data: {
          text: "&nbsp; &nbsp; &nbsp;Technological University (Mandalay) is one of the oldest engineering educational establishments in Myanmar. TUM has total land area of 65.37 Acres (26.45 km^2). It is located in Pathein Gyi Township of Mandalay City.",
        },
        type: "paragraph",
      },
      {
        id: "5u7dkq-maq",
        data: {
          text: "&nbsp; &nbsp; &nbsp;The Technological University, Mandalay is located in the northern Mandalay near the Mandalay Hill in Mandalay, Myanmar. From 1955, the school was known as the Government Technical Institute. In August 1999, it was upgraded to a Government Technological College. In 2007, it was upgraded to the level of University. It now offers ten bachelor's degrees in engineering and architecture. The duration of the courses is 6 years. The Technological University offers Graduate Degree. Now, the University has attending 3000 students. &nbsp; &nbsp;&nbsp;",
        },
        type: "paragraph",
      },
      {
        id: "7sDpNRjyHc",
        data: {
          file: {
            url: "http://localhost:3000/images/6f48bb697d7be116b18f460008a72ee9.jpg",
          },
          caption: "Engineering Programme",
          stretched: false,
          withBorder: false,
          withBackground: false,
        },
        type: "image",
      },
    ],
    version: "2.30.2",
  };
  return (
    <div className="card bg-base-100 w-96 shadow-xl h-96 m-3">
      <figure className="h-1/2">
        {image ? (
          <img src={image.data.file.url} alt={image.data.caption} />
        ) : (
          <img src="/tum-logo.png" alt="image" />
        )}
      </figure>
      <div className="card-body h-1/2 pt-3">
        <h2 className="card-title overflow-ellipsis">
          {title}
          <div className="badge badge-secondary">NEW</div>
        </h2>
        <p className="truncate hover:text-clip">
          {content.replaceAll("&nbsp;", "")}
        </p>
        <div className="card-actions justify-end">
          <div className="badge badge-outline">Fashion</div>
          <div className="badge badge-outline">Products</div>
        </div>
      </div>
    </div>
  );
}

export default MainPageArticles;
