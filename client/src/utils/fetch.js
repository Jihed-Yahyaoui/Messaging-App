export const postData = async (url, data, tokens = {}, signal = null) => {
    return await fetch(`http://localhost:5000/${url}`, {
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
    return await fetch(`http://localhost:5000/${url}`, {
        headers: tokens,
        signal
    })
        .then(res => res.json())
}