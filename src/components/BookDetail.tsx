import { Book } from "../types";

interface BookDisplayProps{
    book:Book
}

function BookDisplay({book}:BookDisplayProps){
    return(
        <a aria-label={`link to book ${book.title} by ${book.authors[0] ? book.authors[0].name:"Not Availble"}`} href={book.formats["text/html"]} target="_blank">
            <img src={book.formats["image/jpeg"]} alt={`image of book cover for ${book.title}`} />
            <h2>{book.title}</h2>
            <p>{book.authors.map(author => author.name).join(",")}</p>
        </a>
    )
}

export default BookDisplay;