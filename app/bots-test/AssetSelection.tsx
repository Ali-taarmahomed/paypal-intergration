import { changeAsset } from '@/state/assetSelection/assetSelectionSlice'
import { AppDispatch, RootState } from '@/state/store'
import { derivAssetsArr } from '@/state/ticks/tickHistorySlice'
import { useDispatch, useSelector } from 'react-redux'

export const AssetSelection = ({ className }: { className: string }) => {
    const selectedAsset = useSelector(
        (state: RootState) => state.assetSelection
    )
    const dispatch = useDispatch<AppDispatch>()

    return (
        <select
            className={className}
            onChange={e => {
                const assets: { name: string; symbol: string } = JSON.parse(
                    e.currentTarget.value
                )

                dispatch(
                    changeAsset({
                        name: assets.name,
                        symbol: assets.symbol,
                    })
                )
            }}
        >
            {derivAssetsArr.map(value => {
                if (value.symbol === selectedAsset.symbol) {
                    return (
                        <option
                            selected
                            key={value.symbol}
                            defaultValue={JSON.stringify({
                                name: value.name,
                                symbol: value.symbol,
                            })}
                        >
                            {value.name}
                        </option>
                    )
                }
                return (
                    <option
                        key={value.symbol}
                        value={JSON.stringify({
                            name: value.name,
                            symbol: value.symbol,
                        })}
                    >
                        {value.name}
                    </option>
                )
            })}
        </select>
    )
}
