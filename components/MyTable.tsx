import Link from 'next/link'

type HeaderT = string | JSX.Element | number

export const MyTable = ({
    title,
    data,
}: {
    title: string
    data: Record<string, HeaderT>[]
}) => {
    const headers = Object.keys(data[0])
    return (
        <div className='mx-3 mb-6 w-full overflow-auto border-b border-gray-200 shadow'>
            <table className='w-full divide-goldAli'>
                <caption className='caption-top py-2 text-xl font-bold uppercase text-goldAli'>
                    {title}
                </caption>
                <thead className='bg-goldAli uppercase text-gray-50'>
                    <tr>
                        {headers.map(value => {
                            return (
                                <th key={value} className='px-6 py-2 text-xs'>
                                    {value}
                                </th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-300 bg-white'>
                    {data.map((item, index) => {
                        return (
                            <tr key={index} className='whitespace-nowrap'>
                                {headers.map(value => {
                                    return (
                                        <td
                                            key={value}
                                            className='px-6 py-2 text-sm text-gray-500'
                                        >
                                            {item[value]}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export const UpdateBtn = ({
    url,
    children,
}: {
    url: string
    children: React.ReactNode[]
}) => {
    return (
        <Link className='flex w-full items-center justify-center' href={url}>
            <button className='bg-yellow-600 px-3 py-2 font-bold text-white hover:opacity-80'>
                {...children}
            </button>
        </Link>
    )
}

export const DeleteBtn = ({
    url,
    children,
}: {
    url: string
    children: React.ReactNode[]
}) => {
    return (
        <Link className='flex w-full items-center justify-center' href={url}>
            <button className='bg-red-600 px-3 py-2 font-bold text-white hover:opacity-80'>
                {...children}
            </button>
        </Link>
    )
}

export const DisabledBtn = ({
    url,
    children,
}: {
    url: string
    children: React.ReactNode[]
}) => {
    return (
        <Link className='flex w-full items-center justify-center' href={url}>
            <button className='bg-gray-600 px-3 py-2 text-white hover:opacity-80'>
                {...children}
            </button>
        </Link>
    )
}

export const ConnectBtn = ({
    url,
    children,
}: {
    url: string
    children: React.ReactNode[]
}) => {
    return (
        <Link className='flex w-full items-center justify-center' href={url}>
            <button className='bg-goldAli px-3 py-2 font-bold text-white hover:opacity-80'>
                {...children}
            </button>
        </Link>
    )
}

export const CountDownBtn = ({
    url,
    children,
}: {
    url: string
    children: React.ReactNode[]
}) => {
    return (
        <Link className='flex w-full items-center justify-center' href={url}>
            <button className='bg-pink-600 px-3 py-2 text-white hover:opacity-80'>
                {...children}
            </button>
        </Link>
    )
}
