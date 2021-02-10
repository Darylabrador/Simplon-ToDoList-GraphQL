import Axios from "axios";

export const apiService = {
    post(url, data = {}){
        return Axios({
            method: 'post',
            url: url,
            data: data,
            headers: headers()
        })
    }
}

function headers() {
    const authHeader = localStorage.getItem('zotToken')
        ? { Authorization: "Bearer " + localStorage.getItem('zotToken') }
        : {};
    return {
        ...authHeader,
        "Content-Type": "application/json"
    }
}