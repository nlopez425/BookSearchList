import { vi,describe, it, expect } from 'vitest';
import {render, screen} from '@testing-library/react';
import BookList from './BookList';

describe("BookList", ()=>{
    it("should render ul element on an empty array", ()=>{
        render(<BookList books={[]}/>);
        const list = screen.queryAllByRole("list");
        expect(list.length).toBe(1);
    })

    it("should render zero list elements on an empty array", ()=>{
        render(<BookList books={[]}/>);
        const listItem = screen.queryAllByRole("listItem");
        expect(listItem.length).toBe(0);
    })

    it("should render n number of list items based on number of elements in array", ()=>{
        const mockBookList = [{id:1,title:"Candy",authors:[], formats:{"text/html":"", "image/jpeg":""}}];
        render(<BookList books={mockBookList}/>);
        const listItem = screen.queryAllByRole("listitem");
        expect(listItem.length).toBe(1);
        expect(listItem[0]).toHaveTextContent("Candy");
    })
})
    