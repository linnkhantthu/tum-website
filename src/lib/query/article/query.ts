import prisma from "@/db";
import { storage } from "@/lib/firebase";
import { Article, Category } from "@/lib/models";
import { ArticleType } from "@prisma/client";
import { deleteObject, ref } from "firebase/storage";

/**
 * Get User by Email
 * @param email
 * @returns User | Undefined
 */
export async function insertArticleByUsername(username?: string) {
  let article;
  let message = "Needed 1 argument got 0.";
  if (username) {
    const author = await prisma.user.findFirst({
      where: { username: username, role: "ADMIN" },
    });
    message = "You need to be an admin to access this function.";
    if (author !== null) {
      article = await prisma.article.create({
        data: {
          userId: author.id,
        },
        select: {
          id: true,
          date: true,
          // content: true,
          type: true,
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
      message =
        article === null
          ? "Failed to create a new article at this time, please try again."
          : "Generated a new article successfully.";
    }
  }
  return { article, message };
}

export async function updateArticleById(
  articleId: string,
  data: object,
  isPublished = false,
  articleType: ArticleType,
  userId: number,
  categoryId?: string
) {
  let article;
  let message;
  try {
    article = await prisma.article.update({
      select: {
        id: true,
        date: true,
        content: true,
        isPublished: true,
        type: true,
        category: true,
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
      where: { id: articleId, userId: userId },
      data: {
        content: data,
        isPublished: isPublished,
        type: articleType,
        categoryId: categoryId,
      },
    });
    message = "Updated article successfully.";
  } catch (error) {
    console.error(error);
    message = "Only the article author can update this article.";
  }
  return { article, message };
}

export async function deletedArticleById(id: string, userId: number) {
  let article: any = undefined;
  let message;
  try {
    article = await prisma.article.delete({
      where: { id: id, userId: userId },
    });
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
    message = "Deleted article successfully along with images.";
  } catch (error) {
    console.error(error);
    message =
      "Failed to delete the article: Only the author can delete its articles.";
  }
  return { article, message };
}

export async function getArticleById(
  id: string,
  isLoggedIn: boolean,
  isVerified: boolean
) {
  let article;
  let message;
  if (isLoggedIn && isVerified) {
    article = await prisma.article.findFirst({
      where: { AND: { id: id } },
      select: {
        id: true,
        date: true,
        content: true,
        isPublished: true,
        type: true,
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
    message =
      article === null
        ? "You need to be logged in and verified to read this article."
        : "Fetched article successfully.";
  } else {
    article = await prisma.article.findFirst({
      where: { AND: { id: id, type: "PUBLIC" } },
      select: {
        id: true,
        date: true,
        content: true,
        isPublished: true,
        type: true,
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
    message =
      article === null
        ? "You need to be a member to read this article."
        : "Fetched article successfully.";
  }

  return { article, message };
}

export async function getArticles(
  take = -8,
  isPublished = true,
  isLoggedIn: boolean,
  isVerified: boolean
) {
  let article;
  let message;
  if (isLoggedIn && isVerified) {
    article = await prisma.article.findMany({
      take: take,
      where: {
        isPublished: isPublished,
      },
      select: {
        id: true,
        date: true,
        content: true,
        isPublished: true,
        type: true,
        author: {
          select: { username: true },
        },
      },
    });
    message =
      article.length === 0
        ? "No articles for public and non-verified users yet."
        : "Fetched articles successfully.";
  } else {
    article = await prisma.article.findMany({
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
        type: true,
        author: {
          select: { username: true },
        },
      },
    });
    message =
      article.length === 0
        ? "Articles are not yet publicly published."
        : "Fetched articles successfully.";
  }
  return { article, message };
}
