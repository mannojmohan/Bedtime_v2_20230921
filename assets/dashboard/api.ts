
// The import below is necessary for async/await to work.
// eslint-disable-next-line no-unused-vars
import Cookies from 'js-cookie';
import { Timestamp } from "./components/recorder/types";

export const BASE_URL = "./api";

export class APIClientError extends Error { }
export class NotFoundError extends Error { }

// TODO: add cache control to get requests.
export async function fetchDetailResult(url: string) {
    let response = await fetch(url, { cache: 'no-cache', });
    if (!response.ok) {
        if (response.status == 404) {
            throw new NotFoundError("Not found :(");
        }
        if (!response.ok) {
            throw new APIClientError(
                "failed at fetching data, non successful response");
        }
    }
    return await response.json();
}

export async function fetchAllResults(url: string) {
    let allResults = [];

    while (url) {
        let response;
        response = await fetch(url, { cache: 'no-cache', });

        if (!response.ok) {
            throw new APIClientError(
                "failed at fetching data, non successful response");
        }

        let data = await response.json();
        if ("results" in data) {
            allResults = allResults.concat(data["results"]);
        } else {
            throw new APIClientError(`unexpected API format ${JSON.stringify(data)}`);
        }
        url = data["next"];
    }
    return allResults;
}


async function submitData(url = '', data = {}, method = 'POST') {

    const csrftoken = Cookies.get('csrftoken');
    const response = await fetch(url, {
        method: method,
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data),
    });
    if (response.ok) {
        let data = await response.json();
        return {
            ok: true, data: data
        };
    }
    if (response.status == 400) {
        let data = await response.json();
        // TODO: move this translation to a better place.
        // Translate between api and the form.
        if (data.nickname) {
            data.name = data.nickname;
        }
        return { ok: false, errors: data };
    } else {
        return { ok: false, message: "Failed on the server side..." };
    }

}


async function submitDataNonJSON(url = '', data = {}, method = 'POST') {

    const csrftoken = Cookies.get('csrftoken');
    const response = await fetch(url, {
        method: method,
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'X-CSRFToken': csrftoken,
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: data,
    });
    if (response.ok) {
        let data = await response.json();
        return {
            ok: true, data: data
        };
    }
    if (response.status == 400) {
        let data = await response.json();
        return { ok: false, errors: data };
    } else {
        return { ok: false, message: "Failed on the server side..." };
    }

}

async function postData(url = '', data = {}) {
    return submitData(url, data, 'POST');
}

async function putData(url = '', data = {}) {
    return submitData(url, data, 'PUT');
}

async function deleteData(url = '', data = {}) {
    const csrftoken = Cookies.get('csrftoken');
    const response = await fetch(url, {
        method: 'DELETE',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data),
    });
    if (response.ok) {
        return {
            ok: true
        };
    } else {
        if (response.status == 400) {
            let data = await response.json();
            return { ok: false, errors: data };
        }
        return { ok: false, message: "Failed on the server side..." };
    }
}


export class APIClient {
    baseUrl: string 

    constructor(baseUrl : string) {
        this.baseUrl = baseUrl;
    }

    async getBooks() {
        let url = this.baseUrl + '/books/?limit=10';
        return fetchAllResults(url);
    }

    async getBook(bookId: number, queryParams? : {key : string, name:string} | undefined) {
        let base_url = this.baseUrl
        if(queryParams?.key){
            base_url =  document.location.href.split('request/')[0]
        }
        console.log(this.baseUrl , base_url)
        let url = queryParams?.key ?`${base_url}/api` + `/books/${bookId}/?key=${queryParams.key}&name=${queryParams.name}` :this.baseUrl + `/books/${bookId}/`;
        return fetchDetailResult(url);
    }

    async getNarrations(bookId?: number) {
        let url = this.baseUrl + '/narrations/?limit=200' + (bookId ? `&book=${bookId}` : '');
        return fetchAllResults(url);
    }

    async getRecordings() {
        let url = this.baseUrl + '/recordings/?limit=200';
        return fetchAllResults(url);
    }


    async createRecording(timestamps: Array<Timestamp>, blob: Blob, bookId: number ,recordingName:string, requestParams:string) {
        let formData = new FormData();
        formData.append('timestamps', JSON.stringify(timestamps));
        formData.append('audio', blob);
        formData.append('book', String(bookId));
        formData.append('narrator_name',String(recordingName) );
        if(requestParams){

            let base_url =  document.location.href.split('request/')[0]
            formData.append('id',String(requestParams) );

            return submitDataNonJSON(`${base_url}api/recordings/`, formData);
        }else{
            return submitDataNonJSON("./api/recordings/", formData);
        }
        
  
    }
    
    


    async getRecordingRequests() {
        let url = this.baseUrl + '/recording_requests/?limit=200';
        return fetchAllResults(url);
    }

    async getRecording(bookId: number) {
        let url = this.baseUrl + `/recordings/?book=${bookId}`;
        return fetchDetailResult(url);
    }
    async getRecordingUrl( bookId: number) {
        let url = this.baseUrl + `/recording_url/?book=${bookId}`;
        return fetchDetailResult(url);
    }
    async saveRecordings(data : {
        book : number;
        narrator_name : string;
        custom_note : string;
        id : string
    }){
        let url = this.baseUrl + `/recording_requests/`
        return postData(url , data);
    }
}