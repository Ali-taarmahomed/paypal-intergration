export const jsonToUrl = ({
    url,
    jsonData,
}: {
    url: string
    jsonData: Record<string, string | number | boolean>
}) => {
    return `${url}?${jsonToUrlParams(jsonData)}`
}

function jsonToUrlParams(json: {
    [key: string]: string | number | boolean
}): string {
    return Object.keys(json)
        .map(
            key => encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
        )
        .join('&')
}
