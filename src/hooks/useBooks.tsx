import { useState , useEffect, useMemo} from "react";
import { BookPage } from "../types";

function useBooks(){
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [bookPage, setBookPage] = useState<BookPage | null>(null);
    const [filter, setFilter] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(()=>{
        const fetchBooks = async ()=>{
            const url = searchTerm ? `https://gutendex.com/books?search=${searchTerm}`:"https://gutendex.com/books/"
            try{
                setLoading(true);
                const response = await fetch(url);
                if(!response.ok) throw new Error(`Network had issues ${response.statusText}`);
                const data = await response.json();
                setBookPage(data);
            }catch(e:unknown){
                if(e instanceof Error){
                    setError(e.message);
                }else if(typeof e === "string"){
                    setError(e);
                }else{
                    setError("something went wrong")
                }
            }finally{
                setLoading(false);
            }
        }

        const debounceFetch = setTimeout(()=>{
            fetchBooks();
        },500)
        return ()=>{ clearTimeout(debounceFetch) }
    },[searchTerm]);

    const sortByTitle = useMemo(()=>{
        if(!bookPage) return [];
        return [...bookPage.results].sort((a,b)=>{
            return a.title.localeCompare(b.title);
        })
    },[bookPage])

    const filteredBookList = useMemo(()=>{
        if(!filter) return sortByTitle;
        return sortByTitle.filter((book)=>{
            return book.authors.some((author)=>{
                return author.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase());
            })
        })
    }, [sortByTitle, filter]);

    const next = async()=>{
        if(!bookPage?.next) return;
        try{
            setLoading(true);
            const response = await fetch(bookPage.next);
            if(!response.ok) throw new Error(`Network problems ${response.status}`);
            const data = await response.json();
            setBookPage(data);
        }catch(e:unknown){
            if(e instanceof Error){
                setError(e.message);
            }else if(typeof e === "string"){
                setError(e);
            }else{
                setError("something went wrong")
            }
        }finally{
            setLoading(false);
        }
    }

    const prev = async()=>{
        if(!bookPage?.next) return;
        try{
            setLoading(true);
            const response = await fetch(bookPage.previous);
            if(!response.ok) throw new Error(`Network problems ${response.status}`);
            const data = await response.json();
            setBookPage(data);
        }catch(e:unknown){
            if(e instanceof Error){
                setError(e.message);
            }else if(typeof e === "string"){
                setError(e);
            }else{
                setError("something went wrong")
            }
        }finally{
            setLoading(false);
        }
    }

    return {
        loading,
        error,
        bookPage,
        filteredBookList,
        filter,
        setFilter,
        searchTerm,
        setSearchTerm,
        next,
        prev
    }
}
export default useBooks;