"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function saveReview(formData: FormData, reviewId?: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const authorName = formData.get("authorName") as string;
  const rating = parseInt(formData.get("rating") as string, 10) || 5;
  const dateText = formData.get("dateText") as string;
  const text = formData.get("text") as string;
  const source = (formData.get("source") as string) || "Яндекс Путешествия";
  const isPinned = formData.get("isPinned") === "true";
  const isVisible = formData.get("isVisible") !== "false";

  if (!authorName || !text) {
    throw new Error("Имя автора и текст отзыва обязательны");
  }

  if (reviewId) {
    await db.review.update({
      where: { id: reviewId },
      data: {
        authorName,
        rating,
        dateText: dateText || "2026",
        text,
        source,
        isPinned,
        isVisible,
      },
    });
  } else {
    const maxOrder = await db.review.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });

    await db.review.create({
      data: {
        authorName,
        rating,
        dateText: dateText || "2026",
        text,
        source,
        isPinned,
        isVisible,
        order: (maxOrder?.order ?? -1) + 1,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/reviews");
}

export async function toggleReviewVisibility(id: string, isVisible: boolean) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await db.review.update({
    where: { id },
    data: { isVisible },
  });

  revalidatePath("/");
  revalidatePath("/admin/reviews");
}

export async function toggleReviewPin(id: string, isPinned: boolean) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await db.review.update({
    where: { id },
    data: { isPinned },
  });

  revalidatePath("/");
  revalidatePath("/admin/reviews");
}

export async function deleteReview(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await db.review.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/admin/reviews");
}
