const getTitleColor = (status: string, ending_date: string) => {
    const currentDate = new Date()
    const deadline = new Date(ending_date)

    const isDeadlineFall = deadline < currentDate

    if (status === "DONE") {
        return "text-green-600"
    } else if (status !== "DONE" && isDeadlineFall) {
        return "text-red-600"
    } else {
        return "text-gray-600"
    }
}

export { getTitleColor }