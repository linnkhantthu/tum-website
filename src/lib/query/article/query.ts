import prisma from "@/db";
import { storage } from "@/lib/firebase";
import { Article } from "@/lib/models";
import { deleteObject, ref } from "firebase/storage";

/**
 * Get User by Email
 * @param email
 * @returns User | Undefined
 */
export async function insertArticleByUsername(username?: string) {
  let data = null;
  if (username) {
    const author = await prisma.user.findFirst({
      where: { username: username },
    });

    if (author !== null) {
      data = await prisma.article.create({
        data: {
          userId: author.id,
        },
        select: {
          id: true,
          date: true,
          // content: true,
          isPublished: true,
          author: {
            select: {
              id: true,
              email: true,
              username: true,
              lastName: true,
              role: true,
              sessionId: true,
              verified: true,
            },
          },
        },
      });
      if (data !== null) {
        return data;
      }
    }
  }
  return undefined;
}

export async function getArticleById(
  id: string,
  isLoggedIn: boolean,
  isVerified: boolean
) {
  let article;
  if (isLoggedIn && isVerified) {
    article = await prisma.article.findFirst({
      where: { AND: { id: id } },
      select: {
        id: true,
        date: true,
        content: true,
        isPublished: true,
        author: {
          select: {
            id: true,
            email: true,
            username: true,
            lastName: true,
            role: true,
            sessionId: true,
            verified: true,
          },
        },
      },
    });
  } else {
    article = await prisma.article.findFirst({
      where: { AND: { id: id, type: "PUBLIC" } },
      select: {
        id: true,
        date: true,
        content: true,
        isPublished: true,
        author: {
          select: {
            id: true,
            email: true,
            username: true,
            lastName: true,
            role: true,
            sessionId: true,
            verified: true,
          },
        },
      },
    });
  }
  return article;
}

export async function getArticles(
  take = -8,
  isPublished = true,
  isLoggedIn: boolean,
  isVerified: boolean
) {
  let articles;

  if (isLoggedIn && isVerified) {
    articles = await prisma.article.findMany({
      take: take,
      where: {
        isPublished: isPublished,
      },
      select: {
        id: true,
        date: true,
        content: true,
        isPublished: true,
        author: {
          select: { username: true },
        },
      },
    });
  } else {
    articles = await prisma.article.findMany({
      take: take,
      where: {
        isPublished: isPublished,
        type: "PUBLIC",
      },
      select: {
        id: true,
        date: true,
        content: true,
        isPublished: true,
        author: {
          select: { username: true },
        },
      },
    });
  }
  return articles;
}

export async function updateArticleById(
  articleId: string,
  data: object,
  isPublished = false
) {
  try {
    const article = await prisma.article.update({
      select: {
        id: true,
        date: true,
        content: true,
        isPublished: true,
        author: {
          select: {
            id: true,
            email: true,
            username: true,
            lastName: true,
            role: true,
            sessionId: true,
            verified: true,
          },
        },
      },
      where: { id: articleId },
      data: { content: data, isPublished: isPublished },
    });
    return article;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

export async function deletedArticleById(id: string) {
  let article: any = undefined;
  let message: any = undefined;
  try {
    article = await prisma.article.delete({ where: { id: id } });
    message = "Deleted article successfully.";
    const _article = article as Article;
    const images = _article.content.blocks.filter(
      (value) => value.type === "image"
    );

    // Delete corresponding images from firebase
    images.map(async (image) => {
      const url: string = image.data.file.url;
      const filename = url.split("%2F")[1].split("?")[0];
      const storageRef = ref(storage, `images/${filename}`);
      await deleteObject(storageRef);
    });
  } catch (error) {
    message = error;
  }
  return { article, message };
}
