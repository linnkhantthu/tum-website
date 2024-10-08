import prisma from "@/db";
import { storage } from "@/lib/firebase";
import { Article, Category, Subcategory } from "@/lib/models";
import { OutputData } from "@editorjs/editorjs";
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
          isPublished: true,
          type: true,
          category: true,
          Subcategory: true,
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

export async function getArticleCount() {
  const count = await prisma.article.count();
  return { count };
}

export async function updateArticleById(
  articleId: string,
  data: object,
  isPublished = false,
  articleType: ArticleType,
  userId: number,
  selectedCategory?: Category,
  selectedSubcategory?: Subcategory
) {
  let article;
  let message;
  const _data: OutputData = data as OutputData;
  const header = _data?.blocks?.filter((value) => value.type === "header")[0];
  const slug: string | undefined = header ? header.data.text : undefined;
  try {
    article = await prisma.article.update({
      select: {
        id: true,
        date: true,
        content: true,
        isPublished: true,
        type: true,
        slug: true,
        category: true,
        Subcategory: true,
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
        date: new Date(),
        slug: slug?.replaceAll(" ", "-").toLowerCase(),
        categoryId: selectedCategory?.id,
        subcategoryId: selectedSubcategory?.id || null,
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
  let count = 1;
  if (id === "latest") {
    article = await prisma.article.findMany({
      take: 1,
      where: {
        isPublished: true,
        type: isLoggedIn && isVerified ? undefined : "PUBLIC",
      },
      orderBy: {
        date: "desc",
      },
      select: {
        id: true,
        date: true,
        content: true,
        isPublished: true,
        type: true,
        slug: true,
        Subcategory: {
          select: {
            id: true,
            date: true,
            label: true,
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
            userId: true,
            categoryId: true,
          },
        },
        category: {
          select: {
            id: true,
            date: true,
            label: true,
            isSpecial: true,
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
            userId: true,
            subcategory: true,
          },
        },
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
    if (isLoggedIn && isVerified) {
      article = await prisma.article.findFirst({
        where: { AND: { id: id } },
        select: {
          id: true,
          date: true,
          content: true,
          isPublished: true,
          slug: true,
          type: true,
          Subcategory: {
            select: {
              id: true,
              date: true,
              label: true,
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
              userId: true,
              categoryId: true,
            },
          },
          category: {
            select: {
              id: true,
              date: true,
              label: true,
              isSpecial: true,
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
              userId: true,
              subcategory: true,
            },
          },
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
        orderBy: {
          date: "desc",
        },
        select: {
          id: true,
          date: true,
          content: true,
          slug: true,
          isPublished: true,
          type: true,
          Subcategory: {
            select: {
              id: true,
              date: true,
              label: true,
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
              userId: true,
              categoryId: true,
            },
          },
          category: {
            select: {
              id: true,
              date: true,
              label: true,
              isSpecial: true,
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
              userId: true,
              subcategory: true,
            },
          },
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
  }

  return { article, message, count };
}

export async function getArticles(
  take: number,
  isPublished = true,
  isLoggedIn: boolean,
  isVerified: boolean,
  skip: number
) {
  let articles;
  let message;
  let count;
  if (isLoggedIn && isVerified) {
    const [fetchedArticles, fetchedCount] = await prisma.$transaction([
      prisma.article.findMany({
        skip: skip,
        take: take,
        where: {
          isPublished: isPublished,
        },
        orderBy: {
          date: "desc",
        },
        select: {
          id: true,
          date: true,
          content: true,
          isPublished: true,
          slug: true,
          type: true,
          Subcategory: {
            select: {
              id: true,
              date: true,
              label: true,
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
              userId: true,
              categoryId: true,
            },
          },
          category: {
            select: {
              id: true,
              date: true,
              label: true,
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
              userId: true,
              subcategory: true,
            },
          },
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
      }),
      prisma.article.count(),
    ]);
    articles = fetchedArticles;
    count = fetchedCount;
    message =
      articles.length === 0
        ? "No articles for public and non-verified users yet."
        : "Fetched articles successfully.";
  } else {
    const [fetchedArticles, fetchedCount] = await prisma.$transaction([
      prisma.article.findMany({
        skip: skip,
        take: take,
        where: {
          isPublished: true,
          type: "PUBLIC",
        },
        orderBy: {
          date: "desc",
        },
        select: {
          id: true,
          date: true,
          content: true,
          isPublished: true,
          slug: true,
          type: true,
          Subcategory: {
            select: {
              id: true,
              date: true,
              label: true,
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
              userId: true,
              categoryId: true,
            },
          },
          category: {
            select: {
              id: true,
              date: true,
              label: true,
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
              userId: true,
              subcategory: true,
            },
          },
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
      }),
      prisma.article.count(),
    ]);
    articles = fetchedArticles;
    count = fetchedCount;
    message =
      articles.length === 0
        ? "Articles are not yet publicly published."
        : "Fetched articles successfully.";
  }

  return { article: articles, message, count };
}

export async function searchArticlesByTitle(
  title: string,
  isUserLoggedAndVerified: boolean
) {
  let articles;
  let message = "Fetched articles successfully.";
  // SELECT *
  // FROM "Article"
  // WHERE EXISTS (
  // SELECT 1
  // FROM jsonb_array_elements(content->'blocks') AS block
  // WHERE
  // -- Full-text search: prioritize exact phrase matches
  // to_tsvector('english', block->'data'->>'text') @@ to_tsquery('${_title}')

  // -- Partial matching: find similar terms or phrases
  // OR block->'data'->>'text' ILIKE '%${title}%'

  // -- Fuzzy matching: handle spelling errors and non-exact matches
  // OR similarity(block->'data'->>'text', '${title}') > 0.2
  // )
  // ORDER BY
  // -- Prioritize exact matches and then fuzzy matches
  // ts_rank(to_tsvector('english', content->>'blocks'), to_tsquery('quick & brown & fox')) DESC,
  // similarity((SELECT block->'data'->>'text' FROM jsonb_array_elements(content->'blocks') AS block LIMIT 1), '${title}') DESC;
  let _title = title.replaceAll(" ", "&");
  _title = _title.endsWith("&")
    ? _title.substring(0, _title.length - 1)
    : _title;
  const typeCondition = isUserLoggedAndVerified
    ? "('PUBLIC', 'PRIVATE')"
    : "('PUBLIC')";

  // Making sure that pg_trgm is installed
  await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm') THEN
              CREATE EXTENSION pg_trgm;
          END IF;
      END $$;
    `);

  articles = await prisma.$queryRawUnsafe(
    `
    SELECT *
    FROM "Article"
    WHERE
    type IN ${typeCondition}
    AND "isPublished" = ${true}
    AND EXISTS (
        SELECT 1
        FROM jsonb_array_elements(content->'blocks') AS block
        WHERE 
            -- Full-text search: prioritize exact phrase matches in 'text'
            to_tsvector('english', block->'data'->>'text') @@ to_tsquery('${_title}')
            
            -- Full-text search in 'items' (array of strings)
            OR EXISTS (
                SELECT 1
                FROM jsonb_array_elements_text(block->'data'->'items') AS item
                WHERE to_tsvector('english', item) @@ to_tsquery('${_title}')
            )
            
            -- Partial matching: find similar terms or phrases in 'text'
            OR block->'data'->>'text' ILIKE '%' || '${title}' || '%'
            
            -- Partial matching in 'items' (array of strings)
            OR EXISTS (
                SELECT 1
                FROM jsonb_array_elements_text(block->'data'->'items') AS item
                WHERE item ILIKE '%' || '${title}' || '%'
            )
            
            -- Fuzzy matching: handle spelling errors and non-exact matches in 'text'
            OR similarity(block->'data'->>'text', '${title}'::text) > 0.1
  
            -- Fuzzy matching for 'items' (array of strings)
            OR EXISTS (
                SELECT 1
                FROM jsonb_array_elements_text(block->'data'->'items') AS item
                WHERE similarity(item, '${title}'::text) > 0.2
            )
    )
    ORDER BY 
        -- Prioritize exact matches and then fuzzy matches
        ts_rank(to_tsvector('english', content->>'blocks'), to_tsquery('${_title}')) DESC,
        
        -- Order by similarity in 'text'
        similarity((SELECT block->'data'->>'text' FROM jsonb_array_elements(content->'blocks') AS block LIMIT 1), '${title}'::text) DESC;
  `
  );

  // console.log("Result: ", articles);
  return { articles, message };
}
