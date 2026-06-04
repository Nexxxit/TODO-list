import { prisma } from "../lib/prisma"

const getSubordinates = async (directorId: number) => {
    const subordinates = await prisma.user.findMany({
        where: { director_id: directorId },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            patronymic: true,
        },
        orderBy: [{ last_name: "asc" }, { first_name: "asc" }],
    })

    return { ok: true as const, statusCode: 200, subordinates }
}

export { getSubordinates }
