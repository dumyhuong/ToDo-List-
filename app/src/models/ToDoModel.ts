import mongoose, { Schema, Document, Model } from 'mongoose';
import { IToDo } from "@/app/src/types";


// Extend Document để Mongoose biết các thuộc tính 
interface IToDoDocument extends Omit<IToDo, '_id'>, Document { }

const todoSchema: Schema = new mongoose.Schema({
    text: {
        type: String, required: true
    },
    complete: { type: Boolean, default: false },
    createdAt: {
        type: Date, default: Date.now
    },
    deadline: { type: Date, required: false }
});

const ToDoModel: Model<IToDoDocument> = mongoose.models.ToDo || mongoose.model<IToDoDocument>('ToDo', todoSchema);
export default ToDoModel;