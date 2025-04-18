export const accumulatorsAutoEntryExit = (accumulatorStatsArr: number[]) => {
    const entries: number[] = []
    const exits: number[] = []

    const accumulatorStats = accumulatorStatsArr.slice(1)

    const accLen = accumulatorStats.length

    for (let i = 1; i < (accLen < 50 ? accLen : 50); i++) {
        if (accumulatorStats[i] < 10) {
            entries.push(accumulatorStats[i])
        } else if (accumulatorStats[i] <= 50) {
            exits.push(accumulatorStats[i])
        }
    }

    const entry = 5
    const exit = 13

    //try mark

    // const dp = new DigitPredictor({
    //     results: [...accumulatorStats].reverse(),
    // })

    // const exitStat = dp.predictNextDigitMarkov()

    const res = {
        entry: Math.ceil(entry),
        exit: Math.floor(exit),
    }
    // console.log(res, accumulatorStats[0])

    return res
}

export const profitsFromAutoEntry = (
    entry: number | null,
    exit: number | null,
    percentage: number = 5
) => {
    if (entry === null || exit === null) return null
    const movement = exit - entry
    const percentageIncrease = (100 + percentage) / 100
    return 0.97 * percentageIncrease ** movement
}
