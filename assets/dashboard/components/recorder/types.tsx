
export type Timestamp = [string, number, number];
export type Recording = {
    blobUrl: string
    timestamps: Array<Timestamp>
};

export type RecordingWithABlob = Recording & {blob: Blob};

export type RecordingRequestApi = {
    id: string
    book: number
    status: string,
    created_at: string,
    last_modified: string,
    narrator_name: string,
    custom_note: string,
}

export type RecordingApi = {
    id: number
    audio: string
    timestamps: Array<Timestamp>
    request: number,
    created_at: string,
    last_modified: string,
    book?: number,
    user: number,
}