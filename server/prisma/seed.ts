import "dotenv/config"
import bcrypt from "bcrypt"
import { prisma } from "../src/lib/prisma"

async function main() {
    const directorHashedPassword = await bcrypt.hash(process.env.PASSWORD_DIRECTOR!, 10)
    const workerHashedPassword = await bcrypt.hash(process.env.PASSWORD_WORKER!, 10)

    const directorLogin = process.env.LOGIN_DIRECTOR ?? "director";
    const workerLogin = process.env.LOGIN_WORKER ?? "worker";

    const director = await prisma.user.upsert({
        where: { login: directorLogin },
        update: {
            first_name: "Иван",
            last_name: "Иванов",
            patronymic: "Иванович",
            password: directorHashedPassword,
            director_id: null,
        },
        create: {
            first_name: "Иван",
            last_name: "Иванов",
            patronymic: "Иванович",
            login: directorLogin,
            password: directorHashedPassword,
            director_id: null,
        }
    })

    const worker = await prisma.user.upsert({
        where: { login: workerLogin },
        update: {
            first_name: "Петр",
            last_name: "Петров",
            patronymic: "Петрович",
            password: workerHashedPassword,
            director_id: director.id,
        },
        create: {
            first_name: "Петр",
            last_name: "Петров",
            patronymic: "Петрович",
            login: workerLogin,
            password: workerHashedPassword,
            director_id: director.id,
        }
    })

    const todo_1 = await prisma.task.upsert({
        where: { title: "Купить хлеб" },
        update: {
            description: "Сходить в магазин и купить хлеб",
            ending_date: new Date("2026-06-15"),
            priority: "MEDIUM",
            status: "TODO",
            creator_id: director.id,
            responsible_id: worker.id,
        },
        create: {
            title: "Купить хлеб",
            description: "Сходить в магазин и купить хлеб",
            ending_date: new Date("2026-06-15"),
            priority: "MEDIUM",
            status: "TODO",
            creator_id: director.id,
            responsible_id: worker.id,
        },
    })

    const todo_2 = await prisma.task.upsert({
        where: { title: "Подготовить отчёт" },
        update: {
            description: "Собрать данные за квартал",
            ending_date: new Date("2026-06-20"),
            priority: "HIGH",
            status: "IN_PROGRESS",
            creator_id: director.id,
            responsible_id: worker.id,
        },
        create: {
            title: "Подготовить отчёт",
            description: "Собрать данные за квартал",
            ending_date: new Date("2026-06-20"),
            priority: "HIGH",
            status: "IN_PROGRESS",
            creator_id: director.id,
            responsible_id: worker.id,
        },
    })

    console.log("Seed done:", {
        director: director.login,
        worker: worker.login,
        tasks: [todo_1.title, todo_2.title],
    })
}

main()
    .catch((e) => {
        console.error("Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    })