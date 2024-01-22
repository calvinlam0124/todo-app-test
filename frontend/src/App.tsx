"use client"

import React, {
    ChangeEvent,
    createContext,
    FormEvent,
    ReactNode,
    useContext,
    useEffect, useRef,
    useState
} from "react";
import {Button, Flex, Form, FormItemProps, Input, InputProps} from 'antd';
import {DeleteOutlined} from '@ant-design/icons';


/**
 * General
 */
interface Duty {
    id: string;
    name: string;
}





/**
 * WIP - Ant Design
 */
function TodoNameInput({itemProps, inputProps} : {itemProps? : FormItemProps, inputProps? : InputProps}){
    return (
        <Form.Item
            name={'todoName'}
            rules={[
                {required: true, message: 'Name should not be empty'},
                {max: 255, message: 'Name exceed 255 chars'},
            ]}
            {...itemProps}
        >
            <Input placeholder="update a new todo" {...inputProps} />
        </Form.Item>
    );
}
interface DutiesFormFields {
    todoName: string
}
function AntDDutiesForm() {
    const [form] = Form.useForm<DutiesFormFields>();
    const {duties, setDuties} = useDutiesContext();

    const onSubmitHandler = async (data: DutiesFormFields) => {
        const formData = new FormData();
        formData.append('name', data.todoName);
        const response = await fetch(`${backendUrl}/`, {
            method: 'POST',
            body: formData,
        });
        const json = await response.json();
        setDuties(json);
    }

    return (
        <div>
            <h3>New TODOs:</h3>
            <Form layout={'inline'} onFinish={onSubmitHandler} >
                <TodoNameInput />
                <Form.Item>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
        </div>
    );
}


interface UpdateDutyFormFields {
    todoId: string;
    todoName: string;
}
function AntDUpdateDutyForm({id, name, index} : UpdateDutyFormProps){
    const [form] = Form.useForm<UpdateDutyFormFields>();
    const {duties, setDuties} = useDutiesContext()

    useEffect(() => {
        form.setFieldValue('todoId', id);
        form.setFieldValue('todoName', name);
    }, [name, id]);

    const onSubmitHandler = async (data: UpdateDutyFormFields) => {
        const name = data.todoName;
        const id = data.todoId;

        const formData = new FormData();
        formData.append('name', name);

        const response = await fetch(`${backendUrl}/${id}`, {
            method: 'PUT',
            body: formData,
        });
        const json = await response.json();
        setDuties(json);
    }

    async function delDuty(id: string) {
        const response = await fetch(`${backendUrl}/${id}`, {
            method: 'DELETE'
        });
        setDuties(await response.json());
    }

    const isHidden = true;
    return (
        <Form layout={'inline'} onFinish={onSubmitHandler} form={form} initialValues={{todoId: id}}>
            <TodoNameInput inputProps={{id: `TodoId${id}`}} itemProps={{initialValue: name}}/>
            <Form.Item name={'todoId'} hidden={isHidden}>
                <Input  />
            </Form.Item>
            <Form.Item>
                <Button type={'primary'} htmlType="submit">Update</Button>
            </Form.Item>
            <Form.Item>
                <Button type="primary" danger={true} icon={<DeleteOutlined/>} onClick={async () => delDuty(id)}/>
            </Form.Item>
        </Form>
    );
}
function AntDDutyDisplay() {
    const {duties, setDuties} = useDutiesContext();

    useEffect(() => {
        (async () => {
            const abortController = new AbortController();
            const response = await fetch(`${backendUrl}/`, {signal: abortController.signal});
            const json = await response.json()
            setDuties(json);

            return () => {
                abortController.abort();
            };
        })();
    }, []);

    return (
        <div>
            <h3>TODOs:</h3>
            <Flex gap="small" vertical={true}>
                {duties.map((item, index) => {
                    return (
                        <div key={index}>
                            <AntDUpdateDutyForm id={item.id} name={item.name} index={index}/>
                        </div>
                    )
                })}
            </Flex>
        </div>
    );
}

export {TodoNameInput, AntDDutiesForm, AntDUpdateDutyForm, AntDDutyDisplay}

/**
 * Environment
 */
const backendUrl = process.env.BACKEND_URL;


/**
 * ToDo Context
 */
interface DutiesContextGetterSetter {
    duties: Duty[],
    setDuties: React.Dispatch<React.SetStateAction<Duty[]>>
}

type DutiesContextType = Duty[];
const DutiesContext = createContext<DutiesContextGetterSetter | null>(null);

function ToDoContextProvider({children}: { children: ReactNode }) {
    const [duties, setDuties] = useState<DutiesContextType>([]);
    return (
        <DutiesContext.Provider
            value={{duties, setDuties}}
        >
            {children}
        </DutiesContext.Provider>
    );
}

function useDutiesContext() {
    const context = useContext(DutiesContext);
    if (!context) {
        throw new Error('useTodoContext error');
    }
    return context;
}


/**
 * Index Component
 * AND export default
 */
export default function App() {
    return (
        <main style={{maxWidth: '1024px', margin: "auto"}} data-testid={'main'}>
            <ToDoContextProvider>
                {/*<DatePicker />*/}
                {/*<span id={'testenv'}>*/}
                {/*    {title} ---- {version} ---- {aaaaa} ---- {backendUrl}*/}
                {/*</span>*/}
                <Flex vertical={true}>
                    <AntDDutiesForm/>
                    <AntDDutyDisplay/>
                </Flex>
                {/*<DutyForm/>*/}
                {/*<DutyDisplay/>*/}
            </ToDoContextProvider>
        </main>
    );
}


/**
 * Duty Creation Form Component
 */
function DutyForm(): JSX.Element {
    const {duties, setDuties} = useDutiesContext()
    const [name, setName] = useState<string>('new-todo');
    const [error, setError] = useState<string | null>('');

    useEffect(() => {
        // function debounce
        const timeoutId = setTimeout(() => {
            if (name.length === 0) {
                setError('Name should not be empty');
            } else {
                setError(null);
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [name]);


    const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        const response = await fetch(`${backendUrl}/`, {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        setDuties(data);
    }


    function onChangeHandler(e: ChangeEvent<HTMLInputElement>) {
        setName(e.target.value)
    }

    return (
        <div>
            <form onSubmit={onSubmitHandler}>
                <label>Todo Name:
                    <input type="text" value={name} onChange={onChangeHandler}/>
                </label>
                {error ? <span style={{color: 'red'}}>{error}</span> : ''}
                <input type="submit" value="Submit" disabled={!!error}/>
            </form>
        </div>
    );
}


/**
 * Duty Listing Component
 */
function DutyDisplay(): JSX.Element {
    const {duties, setDuties} = useDutiesContext()

    useEffect(() => {
        (async () => {
            const abortController = new AbortController();
            const response = await fetch(`${backendUrl}/`, {signal: abortController.signal});
            setDuties(await response.json());
            return () => {
                abortController.abort();
            };
        })();
    }, []);

    return (
        <>
            <h3>TODOs:</h3>
            <ul>
                {duties.map((item, index) => {
                    return <li key={item.id}>
                        <UpdateDutyForm id={item.id} name={item.name} index={index}/>
                    </li>
                })}
            </ul>
        </>
    );
}


/**
 * Duty Update Form Component
 */
interface UpdateDutyFormProps {
    id: string,
    name: string,
    index: number,
}

interface UpdateDutyHTMLFormElements extends HTMLFormElement {
    nameElement: HTMLInputElement;
    idElement: HTMLInputElement;
}

function UpdateDutyForm({id, name, index}: UpdateDutyFormProps): JSX.Element {
    const {duties, setDuties} = useDutiesContext()

    function onChangeHandler(e: ChangeEvent<HTMLInputElement>) {
        const index = parseInt('' + e.target.getAttribute('data-index'));
        const newDuties = [...duties];
        newDuties[index].name = e.target.value;
        setDuties(newDuties);
    }

    const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as UpdateDutyHTMLFormElements;
        const name = form['nameElement'].value;
        const id = form['idElement'].value;

        const formData = new FormData();
        formData.append('name', name);

        const response = await fetch(`${backendUrl}/${id}`, {
            method: 'PUT',
            body: formData,
        });
        const data = await response.json();
        setDuties(data);
    }

    async function delDuty(id: string) {
        const response = await fetch(`${backendUrl}/${id}`, {
            method: 'DELETE'
        });
        setDuties(await response.json());
    }

    return (
        <form onSubmit={onSubmitHandler}>
            <input type={'hidden'} name={'idElement'} value={id}/>
            <input type={'text'} name={'nameElement'} value={name} onChange={onChangeHandler} data-index={index}/>
            <input type={'submit'} value={'Update'}/>
            <a href={'#'} onClick={async () => delDuty(id)}>&#10060;</a>
        </form>
    );
}


/**
 * Extra export for unit tests
 */
export {UpdateDutyForm, useDutiesContext, ToDoContextProvider}
