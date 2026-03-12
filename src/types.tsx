export interface BookPage{
    count:number;
    next:string;
    previous:string;
    results:Book[]
}

export interface Book{
    id:number;
    title:string;
    authors:Author[];
    formats:Format;
}

export interface Author{
    name:string;
    birth_year:number;
    death_year:number;
}

export interface Format{
    "text/html":string;
    "image/jpeg":string;
}