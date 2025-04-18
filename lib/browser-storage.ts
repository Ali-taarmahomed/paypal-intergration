'use client'
export class BrowserStore {
    static set(key: string, data: string) {
        sessionStorage.setItem(key, data)
    }

    static get(key: string) {
        return sessionStorage.getItem(key)
    }
}
