import prisma from "@/db";
import { Article } from "@/lib/models";

/**
 * Get User by Email
 * @param email
 * @returns User | Undefined
 */
export async function insertArticleByUsername(
  username?: string,
  content?: object
) {
  if (username && content) {
    const author = await prisma.user.findFirst({
      where: { username: username },
    });
    if (author !== null) {
      const data = await prisma.article.create({
        data: { content: content, userId: author.id },
      });
      if (data !== null) {
        return data;
      }
    }
  }
  return undefined;
}

export async function getArticleById(id: number) {
  const article = await prisma.article.findFirst({
    where: { id: id },
    include: { author: true },
  });
  return article as unknown as Article;
}

export async function getArticles(take = 10) {
  const article = await prisma.article.findMany({
    take: take,
    include: { author: true },
  });
  return article;
}
