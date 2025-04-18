'use client'
import { DerivTrade, DurationUnitT, OverT } from '@/lib/tradeFormats'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/state/store'
import {
    setDuration,
    setPrediction,
    setStake,
} from '@/state/ManualConfiguration/ManualConfigurationSlice'

export const MatchDiffersConfig = ({
    sendMessage,
}: {
    sendMessage: (message: any) => void
}) => {
    const ManualConfiguration = useSelector(
        (state: RootState) => state.ManualConfiguration
    )

    const assetSelection = useSelector(
        (state: RootState) => state.assetSelection
    )

    const dispatch = useDispatch<AppDispatch>()

    const proposalOne = {
        proposal: 1,
        amount: ManualConfiguration.stake,
        barrier: ManualConfiguration.prediction,
        basis: 'stake',
        contract_type: 'DIGITMATCH',
        currency: 'USD',
        duration: ManualConfiguration.duration,
        duration_unit: ManualConfiguration.durationUnit,
        symbol: assetSelection.symbol,
        passthrough: {
            market: 'digitMatch',
            prediction: ManualConfiguration.prediction,
        },
    }

    const proposalTwo = {
        proposal: 1,
        amount: ManualConfiguration.stake,
        barrier: ManualConfiguration.prediction,
        basis: 'stake',
        contract_type: 'DIGITDIFF',
        currency: 'USD',
        duration: ManualConfiguration.duration,
        duration_unit: ManualConfiguration.durationUnit,
        symbol: assetSelection.symbol,
        passthrough: {
            market: 'digitDiff',
            prediction: ManualConfiguration.prediction,
        },
    }

    useEffect(() => {
        sendMessage(proposalOne)
        sendMessage(proposalTwo)

        return () => {}
    }, [
        ManualConfiguration.prediction,
        ManualConfiguration.stake,
        ManualConfiguration.duration,
    ])

    return (
        <div className='flex flex-col gap-2 py-8 md:flex-row'>
            {/* stake */}
            <div className='flex w-full flex-col items-start justify-center rounded px-3 py-1 text-gray-200'>
                <label className='w-full text-center' htmlFor='Stake'>
                    Stake
                </label>
                <div className='flex w-full gap-1'>
                    <button
                        onClick={() => {
                            dispatch(
                                setStake(
                                    ManualConfiguration.stake <= 1
                                        ? 1
                                        : ManualConfiguration.stake - 1
                                )
                            )
                        }}
                        className='rounded-lg bg-goldAli p-4 text-xl font-extrabold text-gray-100'
                    >
                        -
                    </button>
                    <input
                        className='w-full rounded-lg border border-goldAli bg-blueAli px-3 py-2 text-center text-gray-300 md:py-4'
                        type='text'
                        name='Stake'
                        onChange={e => {
                            const value = e.target.value
                            dispatch(setStake(parseFloat(value)))
                        }}
                        defaultValue={
                            isNaN(ManualConfiguration.stake)
                                ? ''
                                : ManualConfiguration.stake
                        }
                        value={
                            isNaN(ManualConfiguration.stake)
                                ? ''
                                : ManualConfiguration.stake
                        }
                        placeholder='Enter Stake'
                        required
                    />

                    <button
                        onClick={() => {
                            dispatch(setStake(ManualConfiguration.stake + 1))
                        }}
                        className='rounded-lg bg-goldAli p-4 text-xl font-extrabold text-gray-100'
                    >
                        +
                    </button>
                </div>
            </div>

            {/* prediction */}
            <div className='flex w-full flex-col items-start justify-center rounded px-3 py-1 text-gray-200'>
                <label className='w-full text-center' htmlFor='Prediction'>
                    Prediction
                </label>
                <select
                    name='Prediction'
                    className='w-full rounded-lg border border-goldAli bg-blueAli px-3 py-2 text-center text-gray-300 md:py-4'
                    onChange={e => {
                        const myPrediction = e.currentTarget.value
                        dispatch(setPrediction(parseInt(myPrediction)))
                    }}
                >
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((value, index) => {
                        if (value === ManualConfiguration.prediction) {
                            return (
                                <option
                                    selected
                                    key={index}
                                    defaultValue={
                                        ManualConfiguration.prediction
                                    }
                                    value={ManualConfiguration.prediction}
                                >
                                    {value}
                                </option>
                            )
                        }
                        return (
                            <option key={value} value={value}>
                                {value}
                            </option>
                        )
                    })}
                </select>
            </div>

            <div className='grid w-full grid-cols-1'>
                {/* duration */}
                <div className='flex w-full flex-col items-start justify-center rounded px-3 py-1 text-gray-200'>
                    <label className='w-full text-center' htmlFor='Duration'>
                        Duration
                    </label>

                    <div className='flex w-full gap-1'>
                        <button
                            onClick={() => {
                                const newDuration =
                                    ManualConfiguration.duration - 1
                                dispatch(
                                    setDuration({
                                        duration:
                                            newDuration > 10
                                                ? 10
                                                : newDuration < 1
                                                  ? 1
                                                  : newDuration,
                                        durationUnit:
                                            ManualConfiguration.durationUnit,
                                    })
                                )
                            }}
                            className='rounded-lg bg-goldAli p-4 text-xl font-extrabold text-gray-100'
                        >
                            -
                        </button>
                        <input
                            className='w-full rounded-lg border border-goldAli bg-blueAli px-3 py-2 text-center text-gray-300 md:py-4'
                            type='text'
                            name='Duration'
                            onChange={e => {
                                const value = parseInt(e.target.value)

                                const newDuration = value
                                dispatch(
                                    setDuration({
                                        duration:
                                            newDuration > 10
                                                ? 10
                                                : newDuration < 1
                                                  ? 1
                                                  : newDuration,
                                        durationUnit:
                                            ManualConfiguration.durationUnit,
                                    })
                                )
                            }}
                            defaultValue={
                                isNaN(ManualConfiguration.duration)
                                    ? ''
                                    : ManualConfiguration.duration
                            }
                            value={
                                isNaN(ManualConfiguration.duration)
                                    ? ''
                                    : ManualConfiguration.duration
                            }
                            placeholder='Enter Duration'
                            required
                        />
                        <button
                            onClick={() => {
                                const newDuration =
                                    ManualConfiguration.duration + 1
                                dispatch(
                                    setDuration({
                                        duration:
                                            newDuration > 10
                                                ? 10
                                                : newDuration < 1
                                                  ? 1
                                                  : newDuration,
                                        durationUnit:
                                            ManualConfiguration.durationUnit,
                                    })
                                )
                            }}
                            className='rounded-lg bg-goldAli p-4 text-xl font-extrabold text-gray-100'
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* duration unit*/}
                {/* <div className=' flex flex-col w-full px-3 py-1  text-gray-200 rounded justify-center items-start'>
                    <label className='w-full text-center' htmlFor='DurationUnit'>
                        Unit
                    </label>
                    <select
                        name='DurationUnit'
                        className='w-full text-center rounded-lg px-3 py-2 md:py-4 border border-goldAli bg-blueAli text-gray-300'
                        onChange={e => {
                            const myDurationUnit = e.currentTarget.value

                            dispatch(
                                setDuration({
                                    duration: ManualConfiguration.duration,
                                    durationUnit: myDurationUnit,
                                })
                            )
                        }}
                    >
                        {['t', 's', 'm', 'h'].map((value, index) => {
                            if (value === ManualConfiguration.durationUnit) {
                                return (
                                    <option
                                        selected
                                        key={index}
                                        defaultValue={
                                            ManualConfiguration.durationUnit
                                        }
                                        value={ManualConfiguration.durationUnit}
                                    >
                                        {value}
                                    </option>
                                )
                            }
                            return (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            )
                        })}
                    </select>
                </div> */}
            </div>
        </div>
    )
}

export const MatchDiffersTradeButtons = ({
    sendMessage,
}: {
    sendMessage: (message: any) => void
}) => {
    const ContractPayouts = useSelector(
        (state: RootState) => state.ContractPayouts
    )
    const ManualConfiguration = useSelector(
        (state: RootState) => state.ManualConfiguration
    )
    const accountInfo = useSelector((state: RootState) => state.derivUser)
    const selectedAsset = useSelector(
        (state: RootState) => state.assetSelection
    )

    const { overUnderMatchDiffers } = DerivTrade

    const stake = ManualConfiguration.stake
    const barrier = ManualConfiguration.prediction
    const duration = ManualConfiguration.duration
    const durationUnit = ManualConfiguration.durationUnit

    const overUnderMatchDiffersHandler = (contract: OverT) => {
        const contractJson = overUnderMatchDiffers({
            loginid: accountInfo.loginid,
            contract_type: contract,
            barrier: barrier,
            currency: accountInfo.currency,
            stake: stake,
            asset: selectedAsset.symbol,
            duration: duration, // botSetup.time,
            duration_unit: durationUnit as DurationUnitT,
            passthrough: {
                is_virtual_hook: accountInfo.is_virtual_hook,
            },
        })

        return contractJson
    }

    return (
        <div className='fixed bottom-28 left-0 z-50 grid w-full grid-cols-2 gap-2 px-2 py-2 text-gray-100'>
            {/* <div className=' w-full grid grid-cols-2 gap-2 text-gray-100 py-2 px-2'> */}
            <div className='flex items-center justify-center text-center'>
                <button
                    onClick={() => {
                        sendMessage(overUnderMatchDiffersHandler('DIGITMATCH'))
                    }}
                    className='flex w-full flex-col items-center justify-center rounded bg-green-500 py-2 hover:opacity-70'
                >
                    <span>Match</span>
                    <span>
                        {ContractPayouts.digitMatch.payout}{' '}
                        {accountInfo.currency}
                    </span>
                </button>
            </div>

            <div className='flex items-center justify-center text-center'>
                <button
                    onClick={() => {
                        sendMessage(overUnderMatchDiffersHandler('DIGITDIFF'))
                    }}
                    className='flex w-full flex-col items-center justify-center rounded bg-red-500 py-2 hover:opacity-70'
                >
                    <span>Differ</span>
                    <span>
                        {ContractPayouts.digitDiff.payout}{' '}
                        {accountInfo.currency}
                    </span>
                </button>
            </div>
        </div>
    )
}
