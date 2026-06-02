-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_director_id_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "director_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_director_id_fkey" FOREIGN KEY ("director_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
