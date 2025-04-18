type CandleTicks = {
    ticks: string[]
    period: number
}

class Helper {
    static countDecimalPlaces({ number }: { number: number }) {
        // Convert the number to a string
        let numberString = String(number)

        // Check if the number has a decimal point
        if (numberString.includes('.')) {
            // Split the string into integer and decimal parts
            let decimalPart = numberString.split('.')[1]

            // Return the length of the decimal part
            return decimalPart.length
        } else {
            // If there is no decimal point, return 0
            return 0
        }
    }

    static occurenceFrequency({ sortedArr }: { sortedArr: number[] }): {
        rowWinLose: number
        frequency: number
    }[] {
        const occurenceList: any[] = []
        let currentDigit = sortedArr[0]
        let count = 0

        for (let item of sortedArr) {
            if (currentDigit === item) {
                count++
            } else {
                occurenceList.push({
                    rowWinLose: currentDigit,
                    frequency: count,
                })
                currentDigit = item
                count = 1
            }
        }
        return [...occurenceList].sort((a, b) => a.frequency - b.frequency)
    }
}

export class AnalysisConvertions {
    candleFromTicks({ ticks, period }: CandleTicks) {
        return { ticks, period }
    }
    candlesFromCandles() {
        return 0
    }
}

export class TechnicalAnalysis {
    simpleMA() {
        return 0
    }
    expontentialMA() {
        return 0
    }
    relativeStreangthIndex() {
        return 0
    }
    movingAverageConvergenceAndDivergence() {
        return 0
    }
    averageTrueRange() {
        return 0
    }
}

export class SmartMoney {
    supportAndResistance() {
        return 0
    }
    fairValueGap() {
        return 0
    }
    orderBlocks() {
        return 0
    }

    inducementZones() {
        return 0
    }

    liquidityZones() {
        return 0
    }

    structures() {
        return 0
    }

    pointOfInterests() {
        return 0
    }
}

export class TradingSessions {}

export class DigitAnalysis {
    static getLastDigitLists({ ticks }: { ticks: number[] }) {
        const allTicks = [...ticks]
        const tickLen: number = allTicks.length
        const lastDigitsArr: number[] = []
        let higherDecimal = 0
        const decimalCount: number[] = []

        for (let i = 0; i < tickLen; i++) {
            const currentDecimal: number = Helper.countDecimalPlaces({
                number: allTicks[i],
            })
            decimalCount.push(currentDecimal)
            higherDecimal =
                higherDecimal > currentDecimal ? higherDecimal : currentDecimal

            const tickStr = String(allTicks[i])
            lastDigitsArr.push(parseInt(tickStr.charAt(tickStr.length - 1)))
        }

        for (let i = 0; i < tickLen; i++) {
            if (higherDecimal === decimalCount[i]) continue
            lastDigitsArr[i] = 0
        }
        return lastDigitsArr
    }
}
