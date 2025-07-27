-- CreateTable
CREATE TABLE "Thread" (
    "id" SERIAL NOT NULL,
    "post_text" TEXT NOT NULL,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_bumped_at" TIMESTAMP(3) NOT NULL,
    "reply_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Thread_pkey" PRIMARY KEY ("id")
);
