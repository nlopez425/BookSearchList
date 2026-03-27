export type BookPage = {
    count:number;
    next:string;
    previous:string;
    results:Book[]
}

export type Book = {
    id:number;
    title:string;
    authors:Author[];
    formats:Format;
}

export type  Author = {
    name:string;
    birth_year:number;
    death_year:number;
}

export type Format = {
    "text/html":string;
    "image/jpeg":string;
}