"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminProducts, type AdminProduct } from "../data/adminProducts";
import styles from "./ProductForm.module.css";

type ProductFormData = {
  title: string;
  description: string;
  imageUrl: string;
  galleryImages: string[];
  category: string;
  platforms: string[];
  price: string;
  releaseDate: string;
};

interface ProductFormProps {
  initialData?: AdminProduct;
  isEditing?: boolean;
  lookupUrlId?: string;
}

const storageKey = "gamehub-admin-products";
const platformOptions = ["Xbox", "PlayStation", "Nintendo Switch"];
const genreOptions = ["Action", "Adventure", "FPS", "Racing", "RPG"];

function slugify(title: string) {
  // Creates a URL-safe id for newly added games.
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readProducts() {
  // LocalStorage keeps unsaved demo edits visible while the API stores persisted changes.
  if (typeof window === "undefined") {
    return adminProducts;
  }

  try {
    const savedProducts = window.localStorage.getItem(storageKey);
    return savedProducts
      ? (JSON.parse(savedProducts) as AdminProduct[])
      : adminProducts;
  } catch {
    return adminProducts;
  }
}

function toDateInputValue(dateValue?: string) {
  // Converts display dates into the yyyy-mm-dd format required by date inputs.
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

function formatReleaseDate(dateValue: string) {
  // Stores release dates in the same readable format as the storefront.
  const date = new Date(`${dateValue}T00:00:00`);

  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getReleaseYear(dateValue: string) {
  // Release year is derived from the full date, so admins enter it only once.
  return new Date(`${dateValue}T00:00:00`).getFullYear();
}

export function ProductForm({
  initialData,
  isEditing = false,
  lookupUrlId,
}: ProductFormProps) {
  const router = useRouter();
  const [editingProduct, setEditingProduct] = useState(initialData);
  const [formData, setFormData] = useState<ProductFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    imageUrl: initialData?.imageUrl || "/games/god_header.jpg",
    galleryImages: initialData?.galleryImages || [],
    category: initialData?.category || "Action",
    platforms: initialData?.platforms || ["PlayStation"],
    price: initialData ? String(initialData.price) : "79.95",
    releaseDate: toDateInputValue(initialData?.releaseDate),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState("");

  useEffect(() => {
    if (!isEditing || !lookupUrlId) {
      return;
    }

    const savedProduct = readProducts().find(
      (product) => product.urlId === lookupUrlId,
    );

    if (!savedProduct) {
      return;
    }

    setEditingProduct(savedProduct);
    setFormData({
      title: savedProduct.title,
      description: savedProduct.description,
      imageUrl: savedProduct.imageUrl,
      galleryImages: savedProduct.galleryImages || [],
      category: savedProduct.category,
      platforms: savedProduct.platforms,
      price: String(savedProduct.price),
      releaseDate: toDateInputValue(savedProduct.releaseDate),
    });
  }, [isEditing, lookupUrlId]);

  const updateFormData = (nextData: Partial<ProductFormData>) => {
    // Central state update helper for all product form fields.
    setSubmitSuccess("");
    setFormData((currentData) => ({ ...currentData, ...nextData }));
  };

  const togglePlatform = (platform: string) => {
    // Allows one game to appear on multiple console platforms.
    updateFormData({
      platforms: formData.platforms.includes(platform)
        ? formData.platforms.filter((item) => item !== platform)
        : [...formData.platforms, platform],
    });
  };

  const readImageFile = (
    file: File,
    onLoad: (imageUrl: string) => void,
  ) => {
    // Reads local uploads as data URLs for the frontend demo preview.
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onLoad(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleHeaderImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    readImageFile(file, (imageUrl) => updateFormData({ imageUrl }));
  };

  const handleGalleryUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Gallery is capped at three images to match the product detail layout.
    const files = Array.from(event.target.files || []).slice(
      0,
      3 - formData.galleryImages.length,
    );

    files.forEach((file) => {
      readImageFile(file, (imageUrl) => {
        setFormData((currentData) => ({
          ...currentData,
          galleryImages: [...currentData.galleryImages, imageUrl].slice(0, 3),
        }));
      });
    });
  };

  const removeGalleryImage = (imageUrl: string) => {
    updateFormData({
      galleryImages: formData.galleryImages.filter((image) => image !== imageUrl),
    });
  };

  const validate = () => {
    // Basic client-side validation keeps the demo form from saving empty games.
    const nextErrors: Record<string, string> = {};
    const price = Number(formData.price);

    if (!formData.title.trim()) nextErrors.title = "Game name is required";
    if (!formData.description.trim()) {
      nextErrors.description = "Short description is required";
    }
    if (!formData.imageUrl.trim()) nextErrors.imageUrl = "Image path is required";
    if (!formData.category.trim()) nextErrors.category = "Genre is required";
    if (formData.platforms.length === 0) {
      nextErrors.platforms = "At least one platform is required";
    }
    if (!Number.isFinite(price) || price <= 0) {
      nextErrors.price = "Enter a valid price";
    }
    if (!formData.releaseDate.trim()) {
      nextErrors.releaseDate = "Release date is required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    // Saves a new or edited game locally and mirrors it to the product API.
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const currentProducts = readProducts();
    const product: AdminProduct = {
      id: editingProduct?.id || Date.now(),
      urlId: editingProduct?.urlId || slugify(formData.title),
      title: formData.title.trim(),
      description: formData.description.trim(),
      imageUrl: formData.imageUrl.trim(),
      galleryImages: formData.galleryImages,
      category: formData.category.trim(),
      platforms: formData.platforms,
      price: Number(formData.price),
      stock: editingProduct?.stock || 0,
      releaseDate: formatReleaseDate(formData.releaseDate),
      releaseYear: getReleaseYear(formData.releaseDate),
      active: editingProduct?.active ?? true,
    };

    const nextProducts = isEditing
      ? currentProducts.some((item) => item.id === product.id)
        ? currentProducts.map((item) => (item.id === product.id ? product : item))
        : [product, ...currentProducts]
      : [product, ...currentProducts];

    window.localStorage.setItem(storageKey, JSON.stringify(nextProducts));

    try {
      await fetch(isEditing ? `/api/products/${product.id}` : "/api/products", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: product.title,
          description: product.description,
          content: product.description,
          imageUrl: product.imageUrl,
          galleryImages: product.galleryImages || [],
          category: product.category,
          platform: product.platforms.join(", "),
          platforms: product.platforms,
          price: product.price,
          stock: product.stock,
          releaseDate: formData.releaseDate,
          active: product.active,
        }),
      });
    } catch {
      // The local demo still works if the database API is unavailable.
    }

    setSubmitSuccess(
      isEditing ? "Product updated successfully" : "Product created successfully",
    );

    window.setTimeout(() => {
      router.push("/?saved=1");
      router.refresh();
    }, 700);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.grid}>
        <div className={styles.fieldWide}>
          <label htmlFor="title">Game name</label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(event) => updateFormData({ title: event.target.value })}
          />
          {errors.title && <p>{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="category">Genre</label>
          <select
            id="category"
            value={formData.category}
            onChange={(event) => updateFormData({ category: event.target.value })}
          >
            {genreOptions.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          {errors.category && <p>{errors.category}</p>}
        </div>

        <div>
          <label htmlFor="platforms">Platforms</label>
          <div id="platforms" className={styles.optionGroup}>
            {platformOptions.map((platform) => (
              <label key={platform}>
                <input
                  type="checkbox"
                  checked={formData.platforms.includes(platform)}
                  onChange={() => togglePlatform(platform)}
                />
                {platform}
              </label>
            ))}
          </div>
          {errors.platforms && <p>{errors.platforms}</p>}
        </div>

        <div>
          <label htmlFor="price">Price</label>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(event) => updateFormData({ price: event.target.value })}
          />
          {errors.price && <p>{errors.price}</p>}
        </div>

        <div>
          <label htmlFor="releaseDate">Release date</label>
          <input
            id="releaseDate"
            type="date"
            value={formData.releaseDate}
            onChange={(event) =>
              updateFormData({ releaseDate: event.target.value })
            }
          />
          {errors.releaseDate && <p>{errors.releaseDate}</p>}
        </div>

        <div className={styles.fieldWide}>
          <label htmlFor="imageUrl">Header image</label>
          <div className={styles.imageTools}>
            <input
              id="imageUrl"
              type="text"
              value={formData.imageUrl}
              onChange={(event) => updateFormData({ imageUrl: event.target.value })}
            />
            <label className={styles.uploadButton}>
              Upload header
              <input
                type="file"
                accept="image/*"
                onChange={handleHeaderImageUpload}
              />
            </label>
          </div>
          {errors.imageUrl && <p>{errors.imageUrl}</p>}
          <img src={formData.imageUrl} alt="Product preview" />
        </div>

        <div className={styles.fieldWide}>
          <div className={styles.galleryHeader}>
            <label>Gallery images</label>
            <span>{formData.galleryImages.length}/3</span>
          </div>
          <label
            className={`${styles.galleryUpload} ${
              formData.galleryImages.length >= 3 ? styles.disabledUpload : ""
            }`}
          >
            Upload gallery images
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={formData.galleryImages.length >= 3}
              onChange={handleGalleryUpload}
            />
          </label>
          {formData.galleryImages.length > 0 && (
            <div className={styles.galleryGrid}>
              {formData.galleryImages.map((imageUrl, index) => (
                <div key={imageUrl} className={styles.galleryItem}>
                  <img src={imageUrl} alt={`Gallery preview ${index + 1}`} />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(imageUrl)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.fieldWide}>
          <label htmlFor="description">Store description</label>
          <textarea
            id="description"
            rows={4}
            value={formData.description}
            onChange={(event) =>
              updateFormData({ description: event.target.value })
            }
          />
          {errors.description && <p>{errors.description}</p>}
        </div>
      </div>

      {submitSuccess && <div className={styles.success}>{submitSuccess}</div>}

      <div className={styles.actions}>
        <a href="/">Back to dashboard</a>
        <button type="submit">{isEditing ? "Save Game" : "Create Game"}</button>
      </div>
    </form>
  );
}
