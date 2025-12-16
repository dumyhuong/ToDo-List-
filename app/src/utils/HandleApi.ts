import axios from 'axios';
import { IToDo } from "@/app/src/types";
import { toast } from 'react-toastify';

const API_BASE = "/api/todos";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

const getAllToDo = (setToDo: SetState<IToDo[]>) => {
    axios.get<IToDo[]>(API_BASE)
        .then(({ data }) => {
            console.log('data --->', data);
            setToDo(data);
        })
        .catch(err => console.log(err));
};

const addToDo = (
    text: string,
    setText: SetState<string>,
    setToDo: SetState<IToDo[]>,
    deadline?: string
) => {
    axios.post<IToDo>(API_BASE, { text, deadline })
        .then(() => {
            setText("");
            getAllToDo(setToDo);
        });
};

const updateToDo = (
    id: string,
    text: string,
    setToDo: SetState<IToDo[]>,
    setText: SetState<string>,
    setIsUpdating: SetState<boolean>,
    deadline?: string
) => {
    axios.put(`${API_BASE}?id=${id}`, { text, deadline })
        .then(() => {
            setText("");
            setIsUpdating(false);
            getAllToDo(setToDo);
        });
};

const updateComplete = (
    id: string,
    complete: boolean,
    setToDo: SetState<IToDo[]>
) => {
    axios.put(`${API_BASE}?id=${id}`, { complete })
        .then(() => getAllToDo(setToDo));
};

const deleteToDo = (id: string, setToDo: SetState<IToDo[]>) => {
    axios.delete(`${API_BASE}?id=${id}`)
        .then(() => {
            // Gọi lại để cập nhật danh sách
            getAllToDo(setToDo);
            toast.success("Deleted successfully!");
        })
        .catch(err => {
            console.log(err);
            toast.error("Failed to delete ToDo.");
        });
};

export { getAllToDo, addToDo, updateToDo, updateComplete, deleteToDo };