import prisma from "@/db";

export async function insertSubcategoryByUserId(
  userId: number,
  label: string,
  categoryId: string
) {
  let message = "Subcategory is already existed";
  let subcategory;
  // Check if the category is existing
  const existingSubcategory = await prisma.subcategory.findFirst({
    where: { AND: { label: label, categoryId: categoryId } },
  });
  if (existingSubcategory === null) {
    try {
      subcategory = await prisma.subcategory.create({
        data: {
          label: label,
          userId: userId,
          categoryId: categoryId,
        },
      });
      message = "Created subcategory successfully.";
    } catch (error) {
      message = "Internal server error.";
    }
  }
  return { subcategory, message };
}

export async function deleteSubcategoryById(subcategoryId: string) {
  let subcategory;
  let message;
  const articlesCount = await prisma.article.count({
    where: { subcategoryId: subcategoryId },
  });

  message = `There are ${articlesCount} related articles with this subcategory. Please unrelate those subcategories.`;
  if (articlesCount === 0) {
    subcategory = await prisma.subcategory.delete({
      where: { id: subcategoryId },
    });
    message = `Deleted Subcategory: ${subcategory.label}.`;
  }
  console.log(message);
  return { subcategory, message };
}
