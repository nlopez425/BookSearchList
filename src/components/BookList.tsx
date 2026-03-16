import { Book } from "../types";
import BookDisplay from "./BookDetail";

interface BookListProps {
    books:Book[]
}

function BookList({books}:BookListProps){
    return(
        <ul className="no-style">
           {
            books.map((book:Book)=>{
                return <BookDisplay key={book.id} book={book}/>
            })
           }
        </ul>
    );
}

export default BookList;