import prisma from "@/db";

export async function insertCategoryByUserId(userId: number, label: string) {
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
