import { useState, useMemo } from 'react';
import useBooks from './hooks/useBooks';
import BookList from './components/BookList';
import './App.css'

function App() {
  const [filter, setFilter] = useState("");
  const {
    loading,
    error,
    bookPage,
    sortedBookList,
    searchTerm,
    setSearchTerm,
    next,
    prev
  } = useBooks();

  const filteredBookList = useMemo(() => {
    if (!filter) return sortedBookList;
    return sortedBookList.filter((book) => {
      return book.authors.some((author) => {
        return author.name.toLowerCase().includes(filter.toLowerCase());
      });
    });
  }, [sortedBookList, filter]);

  if(loading){
    return(
      <div className="load-skeleton">
        <h1>Loading...</h1>
        <div className="input-skeleton"></div>
        <div className="input-skeleton"></div>
        <div className="nav-skeleton">
          <button className="skeleton"></button>
          <button className="skeleton"></button>
        </div>
        <ul className="book-list-skeleton">
          <li className="book-list-item-skeleton"></li>
          <li className="book-list-item-skeleton"></li>
          <li className="book-list-item-skeleton"></li>
        </ul>
        
      </div>
    )
  };
  if(error) return <p>{error}</p>
  return (
    <>
    <header><h1>The Book List App</h1></header>
    <div className="user-filter-controls">
      <search>
        <label htmlFor="search-input">Search by Title</label>
        <input id="search-input" type="search" value={searchTerm} onChange={(event)=>{ setSearchTerm(event.target.value) }}/>
      </search>
      <label htmlFor="filter-input">Filter by Author</label>
      <input id="filter-input" type="text" value={filter} onChange={(event)=>{ setFilter(event.target.value)}} />
    </div>
    <nav>
      <button disabled={!bookPage?.previous} onClick={prev}>Prev</button>
      <button disabled={!bookPage?.next} onClick={next}>Next</button>
    </nav>
    <main>
      <BookList books={filteredBookList || []}/>
    </main>
   </>
  )
}

export default App
