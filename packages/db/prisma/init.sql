-- Creates the local SQLite schema used by Playwright and CI before seeding.
CREATE TABLE IF NOT EXISTS "Category" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "Product" (
  -- Products are the games shown in the customer storefront.
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "urlId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "galleryImages" TEXT NOT NULL DEFAULT '',
  "platform" TEXT NOT NULL,
  "platforms" TEXT NOT NULL,
  "price" REAL NOT NULL,
  "stock" INTEGER NOT NULL DEFAULT 0,
  "releaseDate" DATETIME NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  "categoryId" INTEGER NOT NULL,
  CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "User" (
  -- Customer contact and delivery details for purchase records.
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "email" TEXT NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "postcode" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Purchase" (
  -- A completed checkout order.
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  "total" REAL NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "PurchaseItem" (
  -- Line items preserve product title and price at purchase time.
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "purchaseId" TEXT NOT NULL,
  "productId" INTEGER NOT NULL,
  "quantity" INTEGER NOT NULL,
  "unitPrice" REAL NOT NULL,
  "productTitle" TEXT NOT NULL,
  "productImageUrl" TEXT NOT NULL,
  CONSTRAINT "PurchaseItem_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "PurchaseItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Unique indexes support category reuse, product URLs, and user lookup.
CREATE UNIQUE INDEX IF NOT EXISTS "Category_name_key" ON "Category"("name");
CREATE UNIQUE INDEX IF NOT EXISTS "Product_urlId_key" ON "Product"("urlId");
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
