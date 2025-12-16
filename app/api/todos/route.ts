// app/api/todos/route.ts

import { NextResponse } from 'next/server';
import ToDoModel from '@/app/src/models/ToDoModel';
import dbConnect from '@/app/src/lib/db';
import { IToDo } from "@/app/src/types";

// Lấy danh sách ToDo
export async function GET() {
    try {
        await dbConnect();
        const docs = await ToDoModel.find().lean();
        const toDo: IToDo[] = docs.map(doc => ({
            ...doc,
            _id: doc._id.toString()
        }));
        return NextResponse.json(toDo, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Lưu ToDo mới
export async function POST(req: Request) {
    try {
        await dbConnect();
        const { text } = await req.json();

        if (!text || (text as string).trim() === "") {
            return NextResponse.json({ error: "Field 'text' is required" }, { status: 400 });
        }

        const created = await ToDoModel.create({ text });
        const newTodo: IToDo = {
            ...created.toObject(),
            _id: created._id.toString()
        };
        return NextResponse.json(newTodo, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// Cập nhật ToDo
export async function PUT(req: Request) {
    try {
        await dbConnect();

        const url = new URL(req.url);
        const id = url.searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Missing ID" }, { status: 400 });
        }

        const body: { text?: string; complete?: boolean } = await req.json();

        // Lấy todo hiện tại
        const existing = await ToDoModel.findById(id).lean();

        if (!existing) {
            return NextResponse.json({ error: "Todo not found" }, { status: 404 });
        }

        // Không cho revert khi đã complete
        if (existing.complete && body.complete === false) {
            return NextResponse.json(
                { error: "Completed todo cannot be reverted" },
                { status: 400 }
            );
        }

        //  Không cho sửa text khi đã complete
        if (existing.complete && body.text !== undefined) {
            return NextResponse.json(
                { error: "Cannot edit completed todo" },
                { status: 400 }
            );
        }

        const updateFields: any = {};

        if (!existing.complete && body.text !== undefined) {
            updateFields.text = body.text;
        }

        if (!existing.complete && body.complete === true) {
            updateFields.complete = true;
        }

        const updated = await ToDoModel.findByIdAndUpdate(
            id,
            updateFields,
            { new: true }
        ).lean();

        if (!updated) {
            return NextResponse.json({ error: "Update failed" }, { status: 500 });
        }

        const result: IToDo = {
            ...updated,
            _id: updated._id.toString(),
        };

        return NextResponse.json(result, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// Xóa ToDo
export async function DELETE(req: Request) {
    try {
        await dbConnect();
        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: "Missing ID" }, { status: 400 });
        }

        await ToDoModel.findByIdAndDelete(id);

        return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}