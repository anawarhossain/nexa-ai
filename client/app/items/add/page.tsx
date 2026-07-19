"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FiPlus, FiTrash2, FiAlertCircle } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { useCreateItem } from "@/hooks/useItems";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ItemFormData } from "@/lib/api";

const CATEGORIES = ["Prompt", "Tutorial", "Tool", "Template", "Resource"] as const;
const PRIORITIES = ["low", "medium", "high"] as const;

const addItemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  shortDescription: z
    .string()
    .min(10, "Short description must be at least 10 characters")
    .max(300),
  fullDescription: z
    .string()
    .min(20, "Full description must be at least 20 characters"),
  category: z.enum(CATEGORIES),
  priority: z.enum(PRIORITIES),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  tags: z
    .array(z.object({ value: z.string().min(1, "Tag cannot be empty") }))
    .max(10, "Maximum 10 tags"),
  images: z
    .array(z.object({ url: z.string().url("Enter a valid image URL") }))
    .max(5, "Maximum 5 images"),
});

type AddItemValues = z.infer<typeof addItemSchema>;

const inputClass =
  "h-11 w-full rounded-xl border border-line bg-white px-4 text-sm text-ink placeholder:text-ash-soft focus:outline-none focus:ring-2 focus:ring-signal/40";
const errorInputClass = "border-ember";
const labelClass = "mb-1.5 block text-sm font-medium text-ink";
const errorClass = "mt-1.5 text-xs text-ember";

export default function AddItemPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const createItem = useCreateItem();

  // Auth guard — redirect if not logged in
  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [session, isPending, router]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddItemValues, unknown, AddItemValues>({
    resolver: zodResolver(addItemSchema) as any,
    defaultValues: {
      category: "Resource",
      priority: "medium",
      price: 0,
      tags: [],
      images: [{ url: "" }],
    },
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({ control, name: "tags" });

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({ control, name: "images" });

  async function onSubmit(values: AddItemValues) {
    const payload: ItemFormData = {
      title: values.title,
      shortDescription: values.shortDescription,
      fullDescription: values.fullDescription,
      category: values.category,
      priority: values.priority,
      price: values.price,
      tags: values.tags.map((t) => t.value),
      images: values.images.map((i) => i.url).filter(Boolean),
    };

    const result = await createItem.mutateAsync(payload);
    if (result?.item?._id) {
      router.push(`/items/${result.item._id}`);
    }
  }

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-signal border-t-transparent" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8">
      <div className="mb-10">
        <span className="font-mono text-[11px] uppercase tracking-wider text-signal">
          Community
        </span>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
          Add a new item
        </h1>
        <p className="mt-2 text-sm text-ash">
          Share an AI prompt, tutorial, tool, template, or resource with the
          community.
        </p>
      </div>

      {createItem.isError && (
        <div className="mb-6 flex items-start gap-2 rounded-xl border border-ember/30 bg-ember/10 px-4 py-3 text-sm text-ink">
          <FiAlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-ember" />
          <span>
            {(createItem.error as any)?.response?.data?.message ??
              "Something went wrong. Please try again."}
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className={labelClass}>
            Title <span className="text-ember">*</span>
          </label>
          <input
            id="title"
            type="text"
            {...register("title")}
            className={cn(inputClass, errors.title && errorInputClass)}
            placeholder="e.g. GPT-4 Blog Post Generator Prompt"
          />
          {errors.title && (
            <p className={errorClass}>{errors.title.message}</p>
          )}
        </div>

        {/* Short description */}
        <div>
          <label htmlFor="shortDescription" className={labelClass}>
            Short description <span className="text-ember">*</span>
          </label>
          <textarea
            id="shortDescription"
            {...register("shortDescription")}
            rows={2}
            className={cn(
              "w-full resize-none rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-ash-soft focus:outline-none focus:ring-2 focus:ring-signal/40",
              errors.shortDescription && errorInputClass
            )}
            placeholder="One or two sentences summarising what this item is."
          />
          {errors.shortDescription && (
            <p className={errorClass}>{errors.shortDescription.message}</p>
          )}
        </div>

        {/* Full description */}
        <div>
          <label htmlFor="fullDescription" className={labelClass}>
            Full description <span className="text-ember">*</span>
          </label>
          <textarea
            id="fullDescription"
            {...register("fullDescription")}
            rows={8}
            className={cn(
              "w-full resize-y rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-ash-soft focus:outline-none focus:ring-2 focus:ring-signal/40",
              errors.fullDescription && errorInputClass
            )}
            placeholder="Full details, usage instructions, examples…"
          />
          {errors.fullDescription && (
            <p className={errorClass}>{errors.fullDescription.message}</p>
          )}
        </div>

        {/* Category + Priority row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className={labelClass}>
              Category <span className="text-ember">*</span>
            </label>
            <select
              id="category"
              {...register("category")}
              className={cn(inputClass, errors.category && errorInputClass)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="priority" className={labelClass}>
              Priority
            </label>
            <select
              id="priority"
              {...register("priority")}
              className={cn(inputClass, errors.priority && errorInputClass)}
            >
              {PRIORITIES.map((pri) => (
                <option key={pri} value={pri}>
                  {pri.charAt(0).toUpperCase() + pri.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className={labelClass}>
            Price (USD) — enter 0 for free
          </label>
          <input
            id="price"
            type="number"
            min={0}
            step={0.01}
            {...register("price")}
            className={cn(inputClass, errors.price && errorInputClass)}
            placeholder="0.00"
          />
          {errors.price && (
            <p className={errorClass}>{errors.price.message}</p>
          )}
        </div>

        {/* Image URLs */}
        <div>
          <label className={labelClass}>
            Image URLs (up to 5)
          </label>
          <div className="space-y-2">
            {imageFields.map((field, i) => (
              <div key={field.id} className="flex gap-2">
                <input
                  id={`image-url-${i}`}
                  type="url"
                  {...register(`images.${i}.url`)}
                  className={cn(
                    inputClass,
                    errors.images?.[i]?.url && errorInputClass
                  )}
                  placeholder="https://example.com/image.jpg"
                />
                {imageFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line text-ash-soft transition-colors hover:border-ember/40 hover:text-ember"
                    aria-label="Remove image"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            {errors.images && !Array.isArray(errors.images) && (
              <p className={errorClass}>{errors.images.message}</p>
            )}
          </div>
          {imageFields.length < 5 && (
            <button
              type="button"
              onClick={() => appendImage({ url: "" })}
              className="mt-2 flex items-center gap-1.5 font-mono text-[12px] text-signal hover:underline"
            >
              <FiPlus className="h-3.5 w-3.5" /> Add image
            </button>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className={labelClass}>
            Tags (up to 10)
          </label>
          <div className="flex flex-wrap gap-2">
            {tagFields.map((field, i) => (
              <div key={field.id} className="flex items-center gap-1">
                <input
                  id={`tag-${i}`}
                  type="text"
                  {...register(`tags.${i}.value`)}
                  className={cn(
                    "h-9 w-28 rounded-full border border-line bg-white px-3 text-[12px] text-ink placeholder:text-ash-soft focus:outline-none focus:ring-2 focus:ring-signal/40",
                    errors.tags?.[i]?.value && errorInputClass
                  )}
                  placeholder="e.g. GPT-4"
                />
                <button
                  type="button"
                  onClick={() => removeTag(i)}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-ash-soft hover:text-ember"
                  aria-label="Remove tag"
                >
                  <FiTrash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
          {tagFields.length < 10 && (
            <button
              type="button"
              onClick={() => appendTag({ value: "" })}
              className="mt-2 flex items-center gap-1.5 font-mono text-[12px] text-signal hover:underline"
            >
              <FiPlus className="h-3.5 w-3.5" /> Add tag
            </button>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full"
          disabled={createItem.isPending}
        >
          {createItem.isPending ? "Publishing…" : "Publish item"}
        </Button>
      </form>
    </div>
  );
}
