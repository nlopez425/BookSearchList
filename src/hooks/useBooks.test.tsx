import useBooks from './useBooks';
import { vi,describe, it, expect } from 'vitest';
import {renderHook, waitFor, act} from '@testing-library/react';

describe("useBooks", ()=>{
    beforeEach(()=>{
        vi.clearAllMocks();
        global.fetch = vi.fn() as unknown as typeof fetch;
    });

    describe("Hook Initialization", ()=>{
        it("should set loading state to true when initializing", async()=>{
            const { result } = renderHook(() => useBooks());
            const {loading} = result.current;
            expect(loading).toBe(true);
        })

        it("should mount and make a call to the book api", async ()=>{
            vi.useFakeTimers({shouldAdvanceTime:true});
            const mockValue = {results:[{id:1, title:"test", authors:[]}]}
            fetch.mockResolvedValue({
                ok:true,
                json: async () => mockValue
            });

            const { result } = renderHook(() => useBooks());
            vi.advanceTimersByTime(500);

            await waitFor(()=>{
                const {bookPage} = result.current;
                expect(bookPage?.results.length).toBe(1);
                expect(bookPage?.results[0].title).toBe("test");
            })
            vi.useRealTimers();
        })

        it("should set loading to false after call is complete", async ()=>{
            vi.useFakeTimers({shouldAdvanceTime:true});
            const mockValue = {results:[{id:1, title:"test", authors:[]}]}
            fetch.mockResolvedValue({
                ok:true,
                json: async () => mockValue
            });

            const { result } = renderHook(() => useBooks());
            vi.advanceTimersByTime(500);

            await waitFor(()=>{
                const {loading} = result.current;
                expect(loading).toBe(false);
            })

            vi.useRealTimers();
        })

        it("should catch errors for http fails", async()=>{
             vi.useFakeTimers({shouldAdvanceTime:true});
            fetch.mockResolvedValue({
                ok:false,
                statusText:"404 not found"
            })
            const {result} = renderHook(()=> useBooks());
            vi.advanceTimersByTime(500);

            await waitFor(()=>{
                const {error} = result.current;
                expect(error).toBe("Network had issues 404 not found");
            })
            vi.useRealTimers();
        })

        it("should handle thrown errors that are type of string", async ()=>{
             vi.useFakeTimers({shouldAdvanceTime:true});
            fetch.mockRejectedValue("Failure in the skynet");
            
            const {result} = renderHook(()=> useBooks());
            vi.advanceTimersByTime(500);

            await waitFor(()=>{
                const {error} = result.current;
                expect(error).toBe("Failure in the skynet");
            })
            vi.useRealTimers();
        })

        it("should set default error if error is not string or instance of Error", async ()=>{
             vi.useFakeTimers({shouldAdvanceTime:true});
            fetch.mockRejectedValue(123);
            
            const {result} = renderHook(()=> useBooks());
            vi.advanceTimersByTime(500);

            await waitFor(()=>{
                const {error} = result.current;
                expect(error).toBe("something went wrong");
            })
            vi.useRealTimers();
        })
    })
    describe("Sorting By Title", ()=>{
        it("should sort the books alpabetically by title", async ()=>{
            vi.useFakeTimers({shouldAdvanceTime:true});
            const mockValue = {
                results:[
                    {id:1, title:"test", authors:[]}, 
                    {id:2, title:"apple", authors:[]}, 
                    {id:3,title:"bannana", authors:[]}]
            }
            fetch.mockResolvedValue({
                ok:true,
                json: async () => mockValue
            });

            const { result } = renderHook(() => useBooks());
            vi.advanceTimersByTime(500);

            await waitFor(()=>{
                const {filteredBookList} = result.current;
                expect(filteredBookList.length).toBe(3);
                expect(filteredBookList[0].title).toBe("apple");
                expect(filteredBookList[1].title).toBe("bannana")
                expect(filteredBookList[2].title).toBe("test")
            })

            vi.useRealTimers();
        })
    })

    describe("Filter", ()=>{
        it("should filter books by author name", async()=>{
            vi.useFakeTimers({shouldAdvanceTime:true});
            const mockValue = {
                results:[
                    {id:1, title:"test", authors:[{name:"allen"}]}, 
                    {id:2, title:"apple", authors:[{name:"bob"}]}, 
                    {id:3,title:"bannana", authors:[{name:"candy"}]}]
            }
            fetch.mockResolvedValue({
                ok:true,
                json: async () => mockValue
            });

            const { result } = renderHook(() => useBooks());
            const { setFilter } = result.current;

            act(()=>{
                setFilter("allen");
            })
            

            await act(async () => {
                vi.advanceTimersByTime(500);
            });
            

            await waitFor(()=>{
                const {filteredBookList} = result.current;
                expect(filteredBookList.length).toBe(1);
                expect(filteredBookList[0].title).toBe("test");
            })

            vi.useRealTimers();
        })

        it("should filter books by a partial match on author", async()=>{
            vi.useFakeTimers({shouldAdvanceTime:true});
            const mockValue = {
                results:[
                    {id:1, title:"test", authors:[{name:"allen"}]}, 
                    {id:2, title:"apple", authors:[{name:"bob"}]}, 
                    {id:3,title:"bannana", authors:[{name:"candy"}]}]
            }
            fetch.mockResolvedValue({
                ok:true,
                json: async () => mockValue
            });

            const { result } = renderHook(() => useBooks());
            const { setFilter } = result.current;
            act(()=>{
                setFilter("o");
            })

            await act(async () => {
                vi.advanceTimersByTime(500);
            });

            await waitFor(()=>{
                const {filteredBookList} = result.current;
                expect(filteredBookList.length).toBe(1);
                expect(filteredBookList[0].title).toBe("apple");
            })

            vi.useRealTimers();
        })

        it("should not filter books by entering a title name", async()=>{
            vi.useFakeTimers({shouldAdvanceTime:true});
            const mockValue = {
                results:[
                    {id:1, title:"test", authors:[{name:"allen"}]}, 
                    {id:2, title:"apple", authors:[{name:"bob"}]}, 
                    {id:3,title:"bannana", authors:[{name:"candy"}]}]
            }
            fetch.mockResolvedValue({
                ok:true,
                json: async () => mockValue
            });

            const { result } = renderHook(() => useBooks());
            const { setFilter } = result.current;

            act(()=>{
                setFilter("test");
            })

            await act(async () => {
                vi.advanceTimersByTime(500);
            });

            await waitFor(()=>{
                const {filteredBookList} = result.current;
                expect(filteredBookList.length).toBe(0);
            })

            vi.useRealTimers();
        })
    })

    describe("Search Behavior", ()=>{
        it("should make a call to the api with a search term when search is updated", async()=>{
            vi.useFakeTimers({shouldAdvanceTime:true})
            fetch.mockResolvedValue({
                ok:true,
                json: async () => ({ results: [] })
            })
            const {result} = renderHook(()=> useBooks());

            await act(async()=>{
                vi.advanceTimersByTime(500);
            })
            
            await waitFor(() => {
                expect(fetch).toHaveBeenCalledTimes(1);
            });

            act(()=>{
                const {setSearchTerm} = result.current;
                setSearchTerm("test");
            })

            await act(async()=>{
                vi.advanceTimersByTime(500);
            })

            await waitFor(()=>{
                expect(fetch).toHaveBeenCalledTimes(2);
                expect(fetch).toHaveBeenLastCalledWith(expect.stringContaining("test"));
            })
            vi.useRealTimers();
        })
    })
    
})