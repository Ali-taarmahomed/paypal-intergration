export const dateConvertion = (dateString?: Date) => {
    const days = {
        short: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
        long: [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
        ],
    }
    const d = dateString === undefined ? new Date() : new Date(dateString)
    const myDay = d.getUTCDay()
    const mySecond = d.getUTCSeconds()
    const myMinute = d.getUTCMinutes()
    const myHour = d.getUTCHours()
    const myDate = d.getUTCDate()
    const myMonth = d.getUTCMonth()
    const myYear = d.getUTCFullYear()

    return {
        year: myYear,
        month: myMonth + 1,
        date: myDate,
        day: [days.short[myDay], days.long[myDay]],
        hour: myHour,
        minute: myMinute,
        second: mySecond,
    }
}

export function PeriodOfDay() {
    const { year, month, date, day, hour } = dateConvertion()

    if (month === 1 && date === 1) {
        return 'Happy New Year'
    }

    if (month === 2 && date === 14) {
        return 'Happy Valentines'
    }

    if (month === 2 && date === 14) {
        return 'Merry Chrismas'
    }

    if (month === 1 && date === 1) {
        return 'Happy New Year'
    }

    if (hour < 12) {
        return 'Good Morning'
    }
    if (hour < 18) {
        return 'Good Afternoon'
    }
    if (hour < 24) {
        return 'Good Evening'
    }
}

export const formatDate = (dateString?: Date) => {
    const { year, month, date, day, hour, minute } = dateConvertion(dateString)

    const hourNew = hour < 10 ? `0${hour}` : `${hour}`
    const minuteNew = minute < 10 ? `0${minute}` : `${minute}`
    const dateNew = date < 10 ? `0${date}` : `${date}`
    const monthNew = month < 10 ? `0${month}` : `${month}`
    const yearNew = year < 1000 ? `000${year}` : `${year}`

    return `${day[0]} ${hourNew}:${minuteNew} ${dateNew}/${monthNew}/${yearNew}`
}

export function hoursMinutesSeconds({
    dateDifference,
}: {
    dateDifference: number
}) {
    const secDiv = 1000
    const minuteDiv = 60 * 1000
    const hourDiv = 60 * 60 * 1000
    const { div: hour, modulus: remHour } = divModulus({
        a: dateDifference,
        b: hourDiv,
    })
    const { div: minute, modulus: remMinute } = divModulus({
        a: remHour,
        b: minuteDiv,
    })
    const { div: second, modulus: remSecond } = divModulus({
        a: remMinute,
        b: secDiv,
    })
    return { hours: hour, minutes: minute, seconds: second }
}

export function divModulus({ a, b }: { a: number; b: number }) {
    const res = a / b
    const div = Math.floor(res)
    return { div, modulus: Math.floor((res - div) * b) }
}
