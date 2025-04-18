import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export type MarkupState = {
    appId: string
    markupAmount: number
    currency: string
    totalTrades: number
    yearMonthDay: string
    month: number
    name: string
    type: string
    yyyymmdd: number
}

const defaultValues = [
    {
        appId: '',
        markupAmount: 0,
        currency: '',
        totalTrades: 0,
        yearMonthDay: '',
        month: 0,
        name: '',
        type: '',
        yyyymmdd: 0,
    },
]
const initialState: MarkupState[] = defaultValues

const markupsSlice = createSlice({
    name: 'markup',
    initialState,
    reducers: {
        setMarkup: (state, action: PayloadAction<MarkupState[]>) => {
            const newState = [...state]
            newState.push(...action.payload)

            const yyyymmdd: string[] = []
            const newArr = []

            for (let item of newState) {
                if (
                    !yyyymmdd.includes(
                        `${item.yyyymmdd}-${item.appId}-${item.type}`
                    )
                ) {
                    yyyymmdd.push(`${item.yyyymmdd}-${item.appId}-${item.type}`)
                    newArr.push(item)
                }

                // custom data
                if (item.type.slice(0, 1) == 'C') {
                    newArr.push(item)
                }
            }

            return newArr
        },
    },
})

export const { setMarkup } = markupsSlice.actions
export const markupsReducer = markupsSlice.reducer
