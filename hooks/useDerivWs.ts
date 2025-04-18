'use client'
import { toast } from 'react-toastify'
import { AppDispatch, RootState } from '@/state/store'
import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect, useRef, useCallback } from 'react'
import {
    defaultValues,
    DerivPriceState,
    initTicks,
} from '@/state/ticks/tickHistorySlice'
import {
    closeTrade,
    closeTradeTransaction,
    openTrade,
    upateExitTick,
    updateTrade,
} from '@/state/trades/tradeHistorySlice'
import { updateAccounts } from '@/state/userAccounts/userAccountsSlice'
import { updateBalance, updateUserData } from '@/state/derivUser/derivUserSlice'
import { tradeDecrement } from '@/state/counter/counterSlice'
import { setMarkup } from '@/state/markups/markupsSlice'
import { saveStat } from '@/state/accumulatorStat/accumulatorStatSlice'
import { setPayout } from '@/state/ContractPayouts/ContractPayoutsSlice'
import { withdraw } from '@/modules/cashier/action'
import { hashData, verifyHash } from '@/helper/hashing'

export type GetTicksT = { limit: number; assets: string[] }
let TickHistoryData: Record<string, DerivPriceState> = defaultValues

export const useDerivWs = ({ token }: { token: string }) => {
    const [reconnect, setReconnect] = useState(true)
    const [isReady, setIsReady] = useState(false)

    const tickHistory = useSelector((state: RootState) => state.tickHistory)
    const accountInfo = useSelector((state: RootState) => state.derivUser)

    const dispatch = useDispatch<AppDispatch>()

    const ws = useRef<WebSocket>()

    const sendMessage = useCallback(
        (message: any) => {
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                ws.current.send(JSON.stringify(message))
            }
        },
        [ws.current]
    )

    const getTicks = useCallback(
        ({ limit = 5000, assets }: GetTicksT) => {
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                for (let asset of assets) {
                    sendMessage({
                        ticks_history: asset,
                        adjust_start_time: 1,
                        count: limit, //5000 too many
                        end: 'latest',
                        // start: 1,
                        style: 'ticks',
                        subscribe: 1,
                    })
                }
            }
        },
        [ws.current]
    )

    useEffect(() => {
        const wsUrl = process.env.NEXT_PUBLIC_DERIV_WS_URL as string
        const appId = process.env.NEXT_PUBLIC_DERIV_APP_ID as string

        ws.current = new WebSocket(
            `${wsUrl}${process.env.NEXT_NODE_ENV === 'development' ? 1089 : appId}`
        )

        ws.current.onopen = () => {
            console.log('Connection Established')

            // establish connection

            sendMessage({
                authorize: token,
                passthrough: { is_virtual_hook: false, token },
            })

            // ping
            sendMessage({
                ping: 1,
            })

            setInterval(() => {
                sendMessage({
                    ping: 1,
                })
            }, 15000)
        }

        ws.current.onmessage = (event: { data: string }) => {
            // console.log(event.data);
            const message = JSON.parse(event.data)
            // console.log(message?.msg_type);
            if (message?.error) {
                console.log(message?.error)

                switch (message?.error.code) {
                    case 'PaymentAgentTransferError':
                        toast.error(message?.error.message)
                        break
                    case 'CashierForwardError':
                        toast.error(message?.error.message)
                        break
                    case 'InputValidationFailed':
                        toast.error(message?.error.message)
                        break
                    case 'InvalidPrice':
                        dispatch(tradeDecrement())
                        break
                    case 'InvalidtoBuy':
                        dispatch(tradeDecrement())
                        break
                    case 'InvalidToken':
                        console.log(JSON.stringify(message))
                        break
                    case 'InsufficientBalance':
                        dispatch(tradeDecrement())
                        break
                    case 'NotDefaultCurrency':
                        dispatch(tradeDecrement())
                        break
                    case 'BarrierValidationError':
                        dispatch(tradeDecrement())
                        break
                    case 'RateLimit':
                        console.log(message?.error)
                        setTimeout(() => {
                            dispatch(tradeDecrement())
                        }, 60000)
                        break
                    case 'InvalidOfferings':
                        dispatch(tradeDecrement())
                        break
                    case 'GetProposalFailure':
                        break
                    case 'ContractCreationFailure':
                        break
                    case 'AlreadySubscribed':
                        toast.error(message?.error.message)
                        break
                    case 'UnrecognisedRequest':
                        break
                    default:
                }
                // console.log(`${data.error.code} :${data.error.message}`);
            } else {
                switch (message?.msg_type) {
                    case 'authorize':
                        setIsReady(prevState => true)

                        console.log(message)
                        const data = message.authorize
                        const is_virtual = data.is_virtual as boolean
                        const is_virtual_hook = message.passthrough
                            .is_virtual_hook as boolean

                        if (is_virtual_hook) {
                            if (!is_virtual && is_virtual_hook) {
                                toast.error(
                                    'Virtual Hook Token Should Be a Demo Account'
                                )
                                break
                            }
                            toast.success('Virtual Hook Account Connected')
                        } else {
                            toast.success('Connected')
                        }

                        sendMessage({
                            balance: 1,
                            subscribe: 1,
                            loginid: data.loginid,
                            passthrough: { is_virtual_hook },
                        })

                        // //transaction stream
                        // sendMessage({
                        //     transaction: 1,
                        //     subscribe: 1,
                        //     loginid: data.loginid,
                        //     passthrough: { is_virtual_hook },
                        // })

                        const userData = {
                            balance: data.balance,
                            country: data.country,
                            currency: data.currency,
                            email: data.email,
                            is_virtual,
                            is_virtual_hook,
                            loginid: data.loginid,
                            fullname: data.fullname,
                            user_id: data.user_id,
                            token: message.passthrough.token,
                            isActivated: !is_virtual_hook,
                        }

                        //main account
                        if (!is_virtual_hook) {
                            dispatch(updateUserData(userData))
                        } else {
                        }

                        //update account for token logger
                        dispatch(
                            updateAccounts({
                                code: data.loginid,
                                token: message.passthrough.token,
                                isLive: data.is_virtual,
                                currency: data.currency,
                            })
                        )

                        break

                    case 'get_settings':
                        console.log(JSON.stringify(message.get_settings))

                        const accountDetails = message.get_settings

                        sendMessage({
                            set_settings: 1,
                            // account_opening_reason:
                            //     accountDetails.account_opening_reason,
                            // address_city: accountDetails.address_city,
                            // address_line_1: accountDetails.address_line_1,
                            // address_line_2: accountDetails.address_line_2,
                            // address_postcode: accountDetails.address_postcode,
                            // address_state: accountDetails.address_state,
                            allow_copiers:
                                accountDetails.allow_copiers === 1 ? 0 : 1,
                            email_consent: accountDetails.email_consent,
                            // phone: accountDetails.phone,
                            // place_of_birth: accountDetails.place_of_birth,
                            preferred_language:
                                accountDetails.preferred_language,
                            // request_professional_status:
                            //     accountDetails.request_professional_status,
                            // tax_identification_number:
                            //     accountDetails.tax_identification_number,
                            tax_residence: accountDetails.tax_residence,
                        })
                        break
                    case 'set_settings':
                        // console.log(message.set_settings)

                        if (message.set_settings?.allow_copiers === 0) {
                        } else {
                        }
                        break

                    case 'contracts_for':
                        const contracts_for = message.contracts_for.available

                        console.log(contracts_for)
                        break
                    // case 'proposal':
                    //     const proposal = message.proposal

                    //     const proposalData = {
                    //         stake: proposal.ask_price,
                    //         payout: proposal.payout,
                    //         market: message.passthrough.market,
                    //         prediction: message.passthrough.prediction,
                    //     }

                    //     console.table(proposalData)
                    //     console.log(message)

                    //     dispatch(setPayout(proposalData))

                    //     break
                    case 'history':
                        const mySymbol = message.echo_req.ticks_history

                        if (Object.keys(TickHistoryData).includes(mySymbol)) {
                            const tickHistory = message.history.prices
                            const tickTime = message.history.times

                            const newTickData = { ...TickHistoryData }
                            newTickData[mySymbol] = {
                                asset: mySymbol,
                                history: tickHistory,
                                time: tickTime,
                            }

                            TickHistoryData = newTickData

                            dispatch(initTicks(newTickData))
                        }

                        break
                    case 'tick':
                        const symbol = message.tick.symbol

                        if (Object.keys(TickHistoryData).includes(symbol)) {
                            const tickHistory = [
                                ...TickHistoryData[symbol]['history'],
                                message.tick.quote,
                            ]
                            const tickTime = [
                                ...TickHistoryData[symbol]['time'],
                                message.tick.epoch,
                            ]

                            tickHistory.shift()
                            tickTime.shift()

                            const newTickData = { ...TickHistoryData }
                            newTickData[symbol] = {
                                asset: symbol,
                                history: tickHistory,
                                time: tickTime,
                            }

                            TickHistoryData = newTickData

                            dispatch(initTicks(newTickData))
                        }
                        break

                    case 'statement':
                        console.log('statement', JSON.stringify(message))
                        break
                    case 'transaction':
                        console.log('transaction', JSON.stringify(message))

                        const transactionMsg = message.transaction

                        if (transactionMsg.action === 'buy') {
                            toast.info(
                                `${transactionMsg.longcode} (${Math.abs(
                                    transactionMsg.amount
                                )} ${transactionMsg.currency})`
                            )
                        }

                        if (transactionMsg.action === 'sell') {
                            dispatch(tradeDecrement())

                            if (transactionMsg.amount > 0) {
                                dispatch(
                                    closeTradeTransaction({
                                        asset: transactionMsg.display_name,
                                        status: 'won',
                                        sell_price: transactionMsg.amount,
                                        contract_id: transactionMsg.contract_id,
                                        payout: transactionMsg.amount,
                                        entry_tick: String('#'),
                                        exit_tick: String('##'),
                                        date_expiry: transactionMsg.date_expiry,
                                    })
                                )

                                toast.success(
                                    `You Won ${Math.abs(transactionMsg.amount)} ${
                                        transactionMsg.currency
                                    }`
                                )
                            } else {
                                dispatch(
                                    closeTradeTransaction({
                                        asset: transactionMsg.display_name,
                                        status: 'lost',
                                        sell_price: transactionMsg.amount,
                                        contract_id: transactionMsg.contract_id,
                                        payout: transactionMsg.amount,
                                        entry_tick: String('#'),
                                        exit_tick: String('##'),
                                        date_expiry: transactionMsg.date_expiry,
                                    })
                                )

                                toast.error(`You Lost`)
                            }
                        }
                        break
                    case 'contracts_for':
                        console.log(JSON.stringify(message.contracts_for))
                        break
                    case 'topup_virtual':
                        const is_virtual_hook_topup_virtual = message
                            .passthrough.is_virtual_hook as boolean

                        if (!is_virtual_hook_topup_virtual) {
                            toast.success('Main Demo Account Reset')
                        } else {
                            toast.success('Virtual Demo Account Reset')
                        }
                        break
                    case 'ping':
                        // console.log('ping');
                        break
                    case 'balance':
                        console.log('balance')
                        console.log(message.balance)
                        const is_virtual_hook_balance = message.passthrough
                            .is_virtual_hook as boolean

                        if (!is_virtual_hook_balance) {
                            dispatch(updateBalance(message.balance.balance))
                        } else {
                        }
                        break
                    case 'buy':
                        toast.info(
                            `${message.buy.longcode} (${Math.abs(message.buy.buy_price)} ${
                                message.echo_req.parameters.currency
                            })`
                        )
                        dispatch(
                            openTrade({
                                buy_price: message.buy.buy_price,
                                sell_price: 0,
                                asset: message.echo_req.parameters.symbol,
                                contract_type:
                                    message.echo_req.parameters.contract_type,
                                contract_id: message.buy.contract_id,
                                longcode: message.buy.longcode,
                                entry_tick: '#',
                                exit_tick: '##',
                                payout: 0,
                                profit: 0,
                                status: 'Pending',
                                date_expiry: 17,
                                loginid: message.echo_req.loginid,
                                is_virtual_hook: message.passthrough
                                    .is_virtual_hook as boolean,
                            })
                        )
                        break

                    case 'proposal':
                        console.log(JSON.stringify(message))

                        const proposalMsg = message.proposal

                        // other proposals
                        if (message.passthrough.market) {
                            const proposalData = {
                                stake: proposalMsg.ask_price,
                                payout: proposalMsg.payout,
                                market: message.passthrough.market,
                                prediction: message.passthrough.prediction,
                            }

                            console.table(proposalData)
                            console.log(message)

                            dispatch(setPayout(proposalData))
                            break
                        }

                        //accumulators proposal

                        const { high_barrier, low_barrier, ticks_stayed_in } =
                            proposalMsg.contract_details

                        if (ticks_stayed_in === undefined) {
                            console.log('broken early')
                            break
                        }

                        const myStake = proposalMsg.validation_params.stake
                        dispatch(
                            saveStat({
                                asset: message.echo_req.symbol,
                                data: {
                                    ticks_stayed_in: ticks_stayed_in,
                                    high_barrier: high_barrier,
                                    low_barrier: low_barrier,
                                    max_stake: myStake.max,
                                    minStake: myStake.min,
                                    percent: message.passthrough.percentage,
                                },
                            })
                        )
                        break
                    case 'proposal_open_contract':
                        if (message.proposal_open_contract?.is_sold) {
                            // console.log(
                            //     'contract',
                            //     message.proposal_open_contract
                            // )

                            const exitTick =
                                message.proposal_open_contract.exit_tick

                            const status = message.proposal_open_contract.status

                            if (status === 'won') {
                                if (
                                    message.proposal_open_contract
                                        .contract_type === 'ACCU'
                                ) {
                                    toast.success(
                                        `You Won $${message.proposal_open_contract.sell_price}`
                                    )
                                } else {
                                    toast.success(
                                        `You Won $${message.proposal_open_contract.payout}`
                                    )
                                }
                            } else {
                                toast.error(
                                    `You Lost $${message.proposal_open_contract.buy_price}`
                                )
                            }

                            const profit = message.proposal_open_contract.profit

                            dispatch(tradeDecrement())

                            // dispatch(dispatch(tradeDecrement()))
                            //setdispatch(tradeDecrement())
                            // dispatch(
                            //     tradeTotalIncrement({
                            //         wins: status === 'won' ? 1 : 0,
                            //     })
                            // )

                            //payout
                            let newPayout = 0
                            if (
                                message.proposal_open_contract.contract_type ===
                                'ACCU'
                            ) {
                                newPayout =
                                    message.proposal_open_contract.sell_price
                            } else {
                                newPayout =
                                    message.proposal_open_contract.payout
                            }

                            dispatch(
                                closeTrade({
                                    status: status,
                                    sell_price: newPayout,
                                    contract_id:
                                        message.proposal_open_contract
                                            .contract_id,
                                    payout: newPayout,
                                    profit: message.proposal_open_contract
                                        .profit,
                                    exit_tick: String(exitTick),
                                    date_expiry:
                                        message.proposal_open_contract
                                            .date_expiry,
                                })
                            )
                        } else {
                            //payout
                            let fluxSellPrice = 0
                            if (
                                message.proposal_open_contract.contract_type ===
                                'ACCU'
                            ) {
                                fluxSellPrice =
                                    message.proposal_open_contract.bid_price
                            } else {
                                fluxSellPrice =
                                    message.proposal_open_contract.payout
                            }
                            dispatch(
                                updateTrade({
                                    asset: `${message.proposal_open_contract.display_name}`,
                                    sell_price: fluxSellPrice,
                                    contract_id:
                                        message.proposal_open_contract
                                            .contract_id,
                                    contract_type:
                                        message.proposal_open_contract
                                            .contract_type,
                                    entry_tick: String(
                                        message.proposal_open_contract
                                            .entry_tick
                                    ),
                                    date_expiry:
                                        message.proposal_open_contract
                                            .date_expiry,
                                })
                            )
                        }

                        break

                    case 'sell':
                        // toast.info(JSON.stringify(message.sell))
                        break

                    case 'buy_contract_for_multiple_accounts':
                        sessionStorage.setItem(
                            'shortcode',
                            message.buy_contract_for_multiple_accounts.shortcode
                        )

                        // toast.info('Trade copied To subscribers')
                        break
                    case 'sell_contract_for_multiple_accounts':
                        // toast.info(
                        //     JSON.stringify(
                        //         message.sell_contract_for_multiple_accounts
                        //     )
                        // )
                        break
                    case 'copy_start':
                        toast.info(JSON.stringify(message.copy_start))

                        if (message.copy_start === 1) {
                        }

                        break
                    case 'copy_stop':
                        toast.info(JSON.stringify(message.copy_stop))
                        if (message.copy_start === 1) {
                        }
                        break
                    case 'copytrading_list':
                        toast.info(JSON.stringify(message.copytrading_list))
                        break
                    case 'copytrading_statistics':
                        toast.info(
                            JSON.stringify(message.copytrading_statistics)
                        )
                        break
                    case 'app_markup_statistics':
                        console.log(
                            'app_markup_statistics',
                            JSON.stringify(message)
                        )

                        if (
                            message.app_markup_statistics.breakdown.length === 0
                        ) {
                            dispatch(
                                setMarkup([
                                    {
                                        appId: '',
                                        markupAmount: 0,
                                        currency: 'USD',
                                        totalTrades: 0,
                                        yearMonthDay:
                                            message.passthrough.yearMonthDay,
                                        month: message.passthrough.month,
                                        name: message.passthrough.name,
                                        type: message.passthrough.type,
                                        yyyymmdd: message.passthrough.yyyymmdd,
                                    },
                                ])
                            )
                            break
                        }

                        const markupArr = []
                        for (
                            let i = 0;
                            i < message.app_markup_statistics.breakdown.length;
                            i++
                        ) {
                            markupArr.push({
                                appId: message.app_markup_statistics.breakdown[
                                    i
                                ].app_id,
                                markupAmount:
                                    message.app_markup_statistics.breakdown[i]
                                        .app_markup_usd,
                                currency:
                                    message.app_markup_statistics.breakdown[i]
                                        .dev_currcode,
                                totalTrades:
                                    message.app_markup_statistics.breakdown[i]
                                        .transactions_count,
                                yearMonthDay: message.passthrough.yearMonthDay,
                                month: message.passthrough.month,
                                name: message.passthrough.name,
                                type: message.passthrough.type,
                                yyyymmdd: message.passthrough.yyyymmdd,
                            })
                        }

                        dispatch(setMarkup(markupArr))

                        break
                    case 'paymentagent_transfer':
                        console.log(
                            'paymentagent_transfer',
                            JSON.stringify(message)
                        )

                        const paymentagent_transfer =
                            message.paymentagent_transfer

                        if (paymentagent_transfer != 1) {
                            toast.error('Your trasfer failed')
                            break
                        }

                        break

                    case 'paymentagent_withdraw':
                        console.log(
                            'paymentagent_withdraw',
                            JSON.stringify(message)
                        )
                        const paymentagent_withdraw =
                            message.paymentagent_withdraw

                        if (paymentagent_withdraw != 1) {
                            toast.error('Withdrawal Failed')
                            break
                        }

                        const {
                            whatsappNumber,
                            amountInUSD,
                            paymentMethod,
                            loginid,
                            email,
                            paymentagent_loginid,
                            signature,
                        } = message.passthrough

                        const dataToVerify = {
                            amountInUSD,
                            paymentMethod,
                            loginid,
                            email,
                            paymentagent_loginid,
                        } as any

                        ;(async () => {
                            const isValid = await verifyHash(
                                JSON.stringify(dataToVerify),
                                signature
                            )

                            if (isValid) {
                                const dataToHash = {
                                    email: accountInfo.email,
                                    loginId: accountInfo.loginid,
                                    amountInUSD,
                                    paymentMethod,
                                }

                                const hashedData = await hashData(
                                    JSON.stringify(dataToHash)
                                )

                                await withdraw({
                                    whatsappNumber: whatsappNumber,
                                    email: accountInfo.email,
                                    loginId: accountInfo.loginid,
                                    amountInUSD,
                                    paymentMethod,
                                    signature: hashedData,
                                    token: accountInfo.token, // ✅ Add this line
                                })

                                toast.success(
                                    'Please wait as we process your request'
                                )
                            } else {
                                toast.error('What are you trying to to')
                            }
                        })()

                        break
                    default:
                }
            }
        }
        ws.current.onclose = (event: { wasClean: any }) => {
            if (event.wasClean) {
                console.log('Disconnected')
                // toast.info('Disconnected')
                // MySwal.fire({
                //     title: 'Disconnected',
                //     text: 'Disconnected From Deriv',
                //     icon: 'warning',
                // })
            } else {
                console.log('Offline')
                // toast.info('Offline')
            }
            setReconnect(prevState => !prevState)
        }

        ws.current.onerror = (error: any) => {
            console.log(error)
        }

        return () => {
            if (process.env.NEXT_NODE_ENV === 'production') {
                ws.current?.close()
            }
        }
    }, [reconnect])
    return {
        isReady,
        sendMessage,
        getTicks,
        ticks: tickHistory,
        accountInfo,
    }
}
