export const postData = async (url, data, tokens = {}, signal = null) => {
    return await fetch(`${import.meta.env.VITE_SERVER_LINK}/${url}`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...tokens
        },
        body: JSON.stringify(data),
        signal
    }).then(res => res.json())
}

export const getData = async (url, tokens = {}, signal = null) => {
    return await fetch(`${import.meta.env.VITE_SERVER_LINK}/${url}`, {
        headers: tokens,
        signal
    })
        .then(res => res.json())
}