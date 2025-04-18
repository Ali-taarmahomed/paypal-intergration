'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export const useSaveLastVisitedPath = () => {
    const pathname = usePathname()
    const cleanPath = pathname.split('?')[0] // Remove query parameters
    const [storedPath, setStoredPath] = useState<string | null>(null)

    useEffect(() => {
        if (cleanPath) {
            localStorage.setItem('lastVisitedPath', cleanPath)
            setStoredPath(cleanPath)
        }
    }, [cleanPath])

    return storedPath
}

export const useGetLastVisitedPath = () => {
    const [storedPath, setStoredPath] = useState<string | null>(null)

    useEffect(() => {
        const path = localStorage.getItem('lastVisitedPath')
        setStoredPath(path)
    }, [])

    return storedPath
}
