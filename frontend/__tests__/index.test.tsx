import App, {AntDUpdateDutyForm, ToDoContextProvider, UpdateDutyForm, useDutiesContext} from '../src/App';
import {describe, expect, test, jest} from "@jest/globals";
import { render, screen } from "@testing-library/react";

// reset fetch
import fetch from 'isomorphic-fetch';
globalThis.fetch = fetch;
// jest hack
// TypeError: window.matchMedia is not a function
// https://stackoverflow.com/questions/39830580/jest-test-fails-typeerror-window-matchmedia-is-not-a-function
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Environment
// console.log(process.env);

// // prepare DutyContext
// const {duties, setDuties} = useDutiesContext();
// const MOCK_INIT_DUTIES = [
//     {id: '11-uuid', name: '11'},
//     {id: '22-uuid', name: '22'},
//     {id: '33-uuid', name: '33'},
// ];
// setDuties(MOCK_INIT_DUTIES);

describe("Index testing", () => {
    // test("Should render content correctly", () => {
    //     // expect(null).toBeNull();
    //
    //     const ele = <App />
    //     render(ele)
    //     // const main = screen.getAllByTestId("testenv");
    //     // screen.debug(main);
    //
    //     // expect(main.root.findByType("div").children).toEqual(['Provided Value']);
    //
    //     // console.log(main);
    //     // expect(main).toHaveTextContent('abc');
    // });

    // test("Should render content correctly", () => {
    //     const ele = <UpdateDutyForm id={'1'} index={2} name={'3'}/>
    //     expect(null).toBeNull();
    // });

    test('Component test - AntD update duty form', async () => {
        const component = render(
            <ToDoContextProvider>
                <AntDUpdateDutyForm id={'test-uuid'} name={'test-name'} index={0}/>
            </ToDoContextProvider>
        );

        const todoNameElement = screen.getByDisplayValue('test-name'); // id="TodoIdtest-uuid"
        // screen.debug(todoNameElement);
        expect(todoNameElement.id).toEqual('TodoIdtest-uuid')

        const todoIdElement = screen.getByDisplayValue('test-uuid'); // value="test-uuid", id="todoId"
        // screen.debug(todoIdElement);
        expect(todoIdElement.id).toEqual('todoId')



        // const re = await screen.getByText(/^test-uuid:/)
        // screen.debug();
        // const re = screen.querySelector('TodoIdtest-uuid');
        // const re = component.
        // const re = component.getAllByRole('input');
        // expect(screen.getByRole('input', { name: 'the-inputs-id' })).toHaveValue('test');
        // const re2 = screen.getByRole('textbox');




        // const re = screen.getAllByText((content, element    ) => {
        //     return element?.tagName.toLowerCase() === 'input'
        // });
        // re.forEach((_element: HTMLElement)=>{
        //     console.log('re', re);
        //     const element = _element as HTMLInputElement;
        //     // id === "TodoIdtest-uuid"
        //     // id === "todoId"
        //     console.log('id', _element['id']);
        //     console.log('id', element['value']);
        //     // console.log('id', _element.getAttribute('id'));
        //     // console.log('id', element?.id);
        //     // console.log('element', `${element.id} =  ${element.value}`);
        //     // console.log('value', element?.getValue() === 'test-uuid');
        //     // console.log('element', element);
        // });
    })
});
