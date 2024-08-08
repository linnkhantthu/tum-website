import prisma from "@/db";

/**
 * Get User by Email
 * @param email
 * @returns User | Undefined
 */
export async function insertArticleByUsername(username?: string) {
  let data = null;
  if (username) {
    console.log("username: ", username);
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

export async function getArticleById(id: string) {
  const article = await prisma.article.findFirst({
    where: { AND: { id: id, isPublished: true } },
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
  return article;
}

export async function getArticles(take = -8, isPublished = true) {
  const article = await prisma.article.findMany({
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
  return article;
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
