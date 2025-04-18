interface PatternRecord {
    before: number
    twin: number
    after: number
}

export class Helper {
    //this was added march 10 2025
    static includeTrailingZeros(numbers: number[]): string[] {
        // Convert numbers to strings and extract decimal parts
        const numberStrings = numbers.map(num => num.toString())
        const decimalParts = numberStrings.map(numStr => {
            const parts = numStr.split('.')
            return parts[1] || '' // Get decimal part or empty string if none
        })

        // Find the longest decimal length
        const maxLength = Math.max(...decimalParts.map(d => d.length))

        // Ensure all numbers have the same decimal length by adding trailing zeros
        return numberStrings.map((numStr, index) => {
            return decimalParts[index].length
                ? `${numStr.padEnd(
                      numStr.length + (maxLength - decimalParts[index].length),
                      '0'
                  )}`
                : `${numStr}.${'0'.repeat(maxLength)}`
        })
    }

    //this was added feb 14 2025
    static getDecimalParts(numbers: number[]): string[] {
        // Convert numbers to strings and extract decimal parts
        const decimalParts = numbers.map(num => {
            const parts = num.toString().split('.')
            return parts[1] || '0' // Get decimal part or "0" if none
        })

        // Find the longest decimal length
        const maxLength = Math.max(...decimalParts.map(d => d.length))

        // Ensure all numbers have the same decimal length by adding zeros
        return decimalParts.map(d => d.padEnd(maxLength, '0'))
    }

    static countOccurrences({
        ticks,
        digit,
    }: {
        ticks: number[]
        digit: number
    }) {
        // Initialize a counter for the occurrences
        let count = 0

        // Iterate through each item in the array
        ticks.forEach(item => {
            // Check if the current item matches the digit
            if (item === digit) {
                count++
            }
        })

        return count
    }
}

export class DigitAnalysis {
    static getLastDigitLists({ ticks }: { ticks: number[] }) {
        return Helper.getDecimalParts(ticks).map(value => {
            const len = value.length
            return parseInt(value[len - 1])
        })
    }

    static calculateDigitPercentage({ ticks }: { ticks: number[] }) {
        const tickLen = ticks.length
        const percentagesDigit = []

        for (let i = 0; i <= 9; i++) {
            const occurrence = Helper.countOccurrences({ ticks, digit: i })
            const percentage = Math.floor((10000 * occurrence) / tickLen) / 100
            percentagesDigit.push({ digit: i, percentage })
        }
        // return percentagesDigit.sort((a, b) => a.percentage - b.percentage); //asc
        return percentagesDigit
    }
}
