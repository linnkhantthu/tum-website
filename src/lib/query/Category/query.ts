import prisma from "@/db";

export async function insertCategoryByUserId(
  userId: number,
  label: string,
  isSpecial: boolean
) {
  let message = "Category is already existed";
  let category;
  // Check if the category is existing
  const existingCategory = await prisma.category.findFirst({
    where: { label: label },
  });
  if (existingCategory === null) {
    try {
      category = await prisma.category.create({
        data: {
          label: label,
          userId: userId,
          isSpecial: isSpecial,
        },
        include: {
          subcategory: {
            select: {
              id: true,
              label: true,
              date: true,
              userId: true,
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
      message = "Created category successfully.";
    } catch (error) {
      message = "Internal server error.";
    }
  }
  return { category, message };
}

export async function getAllCategories() {
  let message;
  let categories;
  try {
    categories = await prisma.category.findMany({
      include: {
        subcategory: {
          include: {
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
        },
      },
    });
    message = "Fetched categories successfully.";
  } catch (error) {
    message = "Internal server error";
  }
  return { categories, message };
}

export async function getSpecialCategoriesAndArticles(take: number) {
  let message;
  let categories;
  try {
    categories = await prisma.category.findMany({
      take: take,
      where: { isSpecial: true },
      include: {
        Article: {
          where: { type: "PUBLIC", isPublished: true },
          include: { Subcategory: true },
        },
        subcategory: {
          include: {
            Article: {
              where: { type: "PUBLIC", isPublished: true },
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
        },
      },
    });
    message = "Fetched categories successfully.";
  } catch (error) {
    message = "Internal server error";
  }
  return { categories, message };
}

export async function deleteCategoryById(categoryId: string) {
  let category;
  let message;
  const articlesCount = await prisma.article.count({
    where: { categoryId: categoryId },
  });

  message = `There are ${articlesCount} related articles with this category. Please unrelate those categories.`;
  if (articlesCount === 0) {
    category = await prisma.category.delete({ where: { id: categoryId } });
    message = `Deleted category: ${category.label}.`;
  }
  return { category, message };
}
