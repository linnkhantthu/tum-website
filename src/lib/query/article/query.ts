import prisma from "@/db";

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
        select: {
          id: true,
          date: true,
          content: true,
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

export async function getArticleById(id: number) {
  const article = await prisma.article.findFirst({
    where: { id: id },
    select: {
      id: true,
      date: true,
      content: true,
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
  return article;
}

export async function getArticles(take = 10) {
  const article = await prisma.article.findMany({
    take: take,
    select: {
      author: {
        select: { username: true },
      },
    },
  });
  return article;
}
