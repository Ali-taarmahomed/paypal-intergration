export type OverT = 'DIGITOVER' | 'DIGITUNDER' | 'DIGITMATCH' | 'DIGITDIFF'
export type EvenT =
    | 'DIGITEVEN'
    | 'DIGITODD'
    | 'CALLE'
    | 'PUTE'
    | 'CALL'
    | 'PUT'
    | 'RESETCALL'
    | 'RESETPUT'
    | 'ASIANU'
    | 'ASIAND'
    | 'RUNHIGH'
    | 'RUNLOW'

export type SelectedT = 'TICKHIGH' | 'TICKLOW'

export type DurationUnitT = 's' | 't' | 'm' | 'h'

export const predictMarkets = [
    'DIGITOVER',
    'DIGITUNDER',
    'DIGITMATCH',
    'DIGITDIFF',
    'TICKHIGH',
    'TICKLOW',
]
export const noPredictionMarkets = [
    'DIGITEVEN',
    'DIGITODD',
    'CALLE',
    'PUTE',
    'CALL',
    'PUT',
    'RESETCALL',
    'RESETPUT',
    'ASIANU',
    'ASIAND',
    'RUNHIGH',
    'RUNLOW',
]

export const tradeDurations = ['s', 't', 'm', 'h']

export const markets: string[] = [...predictMarkets, ...noPredictionMarkets]

export type PassthroughObjT = Record<string, string | number | boolean>

export class DerivTrade {
    static accumulators({
        loginid,
        currency,
        stake,
        asset,
        percentage,
        takeProfit,
        passthrough,
    }: {
        loginid: string
        currency: string
        stake: number
        asset: string
        percentage: number
        takeProfit: number
        passthrough: PassthroughObjT
    }) {
        if (isNaN(takeProfit)) {
            return {
                buy: 1,
                subscribe: 1,
                price: stake,
                loginid,
                parameters: {
                    amount: stake,
                    basis: 'stake',
                    currency: currency,
                    symbol: asset,
                    contract_type: 'ACCU',
                    growth_rate: percentage / 100,
                },
                passthrough,
            }
        }

        return {
            buy: 1,
            subscribe: 1,
            price: stake,
            loginid,
            parameters: {
                amount: stake,
                basis: 'stake',
                currency: currency,
                symbol: asset,
                contract_type: 'ACCU',
                growth_rate: percentage / 100,
                limit_order: {
                    take_profit: takeProfit === 0 ? 3500 : takeProfit,
                },
            },
            passthrough,
        }
    }
    static overUnderMatchDiffers({
        loginid,
        contract_type,
        barrier,
        currency,
        stake,
        asset,
        duration,
        duration_unit,
        passthrough,
    }: {
        loginid: string
        contract_type: OverT
        barrier: number
        currency: string
        stake: number
        asset: string
        duration: number
        duration_unit: DurationUnitT
        passthrough: PassthroughObjT
    }) {
        return {
            buy: 1,
            subscribe: 1,
            price: stake,
            loginid,
            parameters: {
                amount: stake,
                basis: 'stake',
                contract_type: contract_type,
                barrier: barrier,
                currency: currency,
                duration: duration,
                duration_unit: duration_unit,
                symbol: asset,
            },
            passthrough,
        }
    }

    static selectedTick({
        loginid,
        contract_type,
        selected_tick,
        currency,
        stake,
        asset,
        duration,
        duration_unit,
        passthrough,
    }: {
        loginid: string
        contract_type: SelectedT
        selected_tick: number
        currency: string
        stake: number
        asset: string
        duration: number
        duration_unit: DurationUnitT
        passthrough: PassthroughObjT
    }) {
        return {
            buy: 1,
            subscribe: 1,
            price: stake,
            loginid,
            parameters: {
                amount: stake,
                basis: 'stake',
                contract_type: contract_type,
                selected_tick: selected_tick,
                currency: currency,
                duration: duration,
                duration_unit: duration_unit,
                symbol: asset,
            },
            passthrough,
        }
    }

    static evenOddRiseFall({
        loginid,
        contract_type,
        currency,
        stake,
        asset,
        duration,
        duration_unit,
        passthrough,
    }: {
        loginid: string
        contract_type: EvenT
        currency: string
        stake: number
        asset: string
        duration: number
        duration_unit: DurationUnitT
        passthrough: PassthroughObjT
    }) {
        return {
            buy: 1,
            subscribe: 1,
            price: stake,
            loginid,
            parameters: {
                amount: stake,
                basis: 'stake',
                contract_type: contract_type,
                // barrier: barrier,
                currency: currency,
                duration: duration,
                duration_unit: duration_unit,
                symbol: asset,
            },
            passthrough,
        }
    }

    static sellContract({
        loginid,
        contract_id,
        price,
        passthrough,
    }: {
        loginid: string
        contract_id: number
        price: number
        passthrough: PassthroughObjT
    }) {
        return {
            loginid,
            sell: contract_id,
            price,
            passthrough,
        }
    }

    static sellContractMultiple({
        loginid,
        shortcode,
        price,
        tokens,
        passthrough,
    }: {
        loginid: string
        shortcode: string
        price: number
        tokens: string[]
        passthrough: PassthroughObjT
    }) {
        return {
            loginid,
            sell_contract_for_multiple_accounts: 1,
            price,
            shortcode,
            tokens,
            passthrough,
        }
    }
}
