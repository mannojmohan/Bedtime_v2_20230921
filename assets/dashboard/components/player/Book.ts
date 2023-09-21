
export type Narration = {
    narrator_name: string;
    audio: string;
    timestamps: Array<any>
}


export type Book = {
    id: number,
    title: string,
    description: string,
    narrations: { [key: string]: Narration },
    pages:  Array<any>,
};