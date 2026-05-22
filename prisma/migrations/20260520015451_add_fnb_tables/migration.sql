-- CreateTable
CREATE TABLE "activities" (
    "id" INTEGER NOT NULL,
    "source_stt" INTEGER,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "drive_link" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_assets" (
    "id" INTEGER NOT NULL,
    "source_stt" INTEGER,
    "type" TEXT NOT NULL,
    "title" TEXT,
    "url" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "app_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "best_seller_items" (
    "id" INTEGER NOT NULL,
    "list_id" INTEGER NOT NULL,
    "target_type" TEXT NOT NULL,
    "target_id" INTEGER NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "badge_text" TEXT,
    "rank_order" INTEGER NOT NULL DEFAULT 0,
    "start_date" DATE,
    "end_date" DATE,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "best_seller_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "best_seller_lists" (
    "id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "display_position" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "best_seller_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_files" (
    "id" INTEGER NOT NULL,
    "drive_file_id" TEXT NOT NULL,
    "original_name" TEXT,
    "mime_type" TEXT,
    "file_size" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "public_path" TEXT,
    "checksum" TEXT,
    "status" TEXT DEFAULT 'downloaded',
    "error_code" TEXT,
    "error_message" TEXT,
    "downloaded_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "media_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notes" (
    "id" INTEGER NOT NULL,
    "source_stt" INTEGER,
    "category" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "place_media" (
    "id" INTEGER NOT NULL,
    "owner_type" TEXT NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "media_file_id" INTEGER NOT NULL,
    "source_id" INTEGER,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "place_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "place_media_sources" (
    "id" INTEGER NOT NULL,
    "owner_type" TEXT NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "source_url" TEXT NOT NULL,
    "source_kind" TEXT,
    "drive_id" TEXT,
    "status" TEXT DEFAULT 'pending',
    "last_checked_at" TIMESTAMP(3),
    "error_code" TEXT,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "place_media_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "place_tags" (
    "place_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3),

    CONSTRAINT "place_tags_pkey" PRIMARY KEY ("place_id","tag_id")
);

-- CreateTable
CREATE TABLE "places" (
    "id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "source_sheet" TEXT,
    "source_stt" INTEGER,
    "external_id" TEXT,
    "name" TEXT NOT NULL,
    "model" TEXT,
    "service_type" TEXT,
    "style" TEXT,
    "best_time" TEXT,
    "direction" TEXT,
    "highlights" TEXT,
    "note" TEXT,
    "address" TEXT,
    "area_text" TEXT,
    "ward" TEXT,
    "district" TEXT,
    "city" TEXT DEFAULT 'Đà Lạt',
    "price_text" TEXT,
    "price_min" INTEGER,
    "price_max" INTEGER,
    "is_free" BOOLEAN NOT NULL DEFAULT false,
    "currency" TEXT DEFAULT 'VND',
    "opening_hours" TEXT,
    "phone" TEXT,
    "partner_relation" TEXT,
    "partner_priority" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),
    "meal_type" TEXT,

    CONSTRAINT "places_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raw_rows" (
    "id" INTEGER NOT NULL,
    "import_id" INTEGER,
    "source_sheet" TEXT NOT NULL,
    "source_stt" INTEGER,
    "raw_json" TEXT NOT NULL,
    "imported_at" TIMESTAMP(3),

    CONSTRAINT "raw_rows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "source_imports" (
    "id" INTEGER NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_path" TEXT,
    "imported_at" TIMESTAMP(3),
    "total_rows" INTEGER NOT NULL DEFAULT 0,
    "success_rows" INTEGER NOT NULL DEFAULT 0,
    "failed_rows" INTEGER NOT NULL DEFAULT 0,
    "note" TEXT,

    CONSTRAINT "source_imports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "group_name" TEXT,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);
