import { Book, Narration } from './components/player/Book'

import { APIClient, BASE_URL } from './api';


function narrationsByNarratorName(narrations: Narration[]): { [key: string]: Narration } {
    let convertedNarrations: { [key: string]: Narration } = {};

    for (let narration of narrations) {
        convertedNarrations[narration.narrator_name] = narration;
    }
    return convertedNarrations;
}

type Page = {
    image: string
    label: string
    page_number: number
}

function sortPages(pages: Array<Page>) {
    let simplePages: Array<[string, string]> = [];
    pages.sort((a: Page, b: Page) => a.page_number - b.page_number);

    for (let page of pages) {
        simplePages.push([page.label, page.image])
    }
    return simplePages;
}

export async function getBook(bookId: number , queryParams:{key : string, name:string} | undefined) {
    const client = new APIClient(BASE_URL);

    let book: Book
    if(queryParams?.key){
         book = await client.getBook(bookId , queryParams);
    }else{
    book = await client.getBook(bookId);
    let narrations = await client.getNarrations(bookId);
    book.narrations = narrationsByNarratorName(narrations);
    }
    book.pages = sortPages(book.pages);

    

    return book;
}


export async function getBooks() {
    const client = new APIClient(BASE_URL);
    const books = await client.getBooks();
    let registry: { [key: string]: Book } = {};
    for (let book of books) {
        registry[book.id] = book;
        book.pages = sortPages(book.pages);
    }
    return registry;
}

export async function getRecordingRequests() {
    const client = new APIClient(BASE_URL);
    const recordingRequests = await client.getRecordingRequests();
    return recordingRequests;
}

export async function getRecordings() {
    const client = new APIClient(BASE_URL);
    const recordings = await client.getRecordings();
    return recordings;
}

export async function getRecording(bookId: number) {
    const client = new APIClient(BASE_URL);
    const recording = await client.getRecording(bookId);
    return recording;
}
export async function getRecordingUrl(bookId: number) {
    const client = new APIClient(BASE_URL);
    const recording = await client.getRecordingUrl(bookId);
    return recording;
}
export async function saveRecording(bookId: number, narrator_name:string, custom_note: string, id:string ) {
    const client = new APIClient(BASE_URL);
    const recording = await client.saveRecordings({
        book : bookId,
        narrator_name : narrator_name,
        custom_note : custom_note,
        id : id
    });
    return recording;
}

export function getQueryParams() {
    let url = document.location.href
    const queryString = url.split('?')[1];
    if (!queryString) return {};
  
    const params = {};
    const keyValuePairs = queryString.split('&');
  
    keyValuePairs.forEach((pair) => {
      const [key, value] = pair.split('=');
      const decodedKey = decodeURIComponent(key);
      const decodedValue = decodeURIComponent(value || '');
      params[decodedKey] = decodedValue;
    });
  
    return params;
  }

  export const copyToClipboard = (url : string) => {
    navigator.clipboard.writeText(url)
        .then(() => {
            alert("URL copied to clipboard!");
        })
        .catch((error) => {
            console.error("Error copying text to clipboard:", error);
        });
};
