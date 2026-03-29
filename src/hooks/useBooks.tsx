import { useState , useEffect, useMemo, useCallback} from "react";
import { BookPage } from "../types";

function useBooks(){
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [bookPage, setBookPage] = useState<BookPage | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchBooks = useCallback(async (url:string)=>{
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
    },[])

    useEffect(()=>{
         const url = searchTerm ? `https://gutendex.com/books?search=${searchTerm}`:"https://gutendex.com/books/"
        const debounceFetch = setTimeout(()=>{
            fetchBooks(url);
        },500)
        return ()=>{ clearTimeout(debounceFetch) }
    },[searchTerm]);

    const sortedBookList = useMemo(()=>{
        if(!bookPage) return [];
        return [...bookPage.results].sort((a,b)=>{
            return a.title.localeCompare(b.title);
        })
    },[bookPage])

    const next = async()=>{
        if(!bookPage?.next) return;
        fetchBooks(bookPage.next);
    }

    const prev = async()=>{
        if(!bookPage?.next) return;
        fetchBooks(bookPage.previous);
    }

    return {
        loading,
        error,
        bookPage,
        sortedBookList,
        searchTerm,
        setSearchTerm,
        next,
        prev
    }
}
export default useBooks;