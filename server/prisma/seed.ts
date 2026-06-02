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

    console.log("Seed done:", { director: director.login, worker: worker.login })
}

main()
    .catch((e) => {
        console.error("Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    })