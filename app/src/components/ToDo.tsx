"use client";

import React from "react";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { FiCheckCircle, FiCircle } from "react-icons/fi";
import { IToDo } from "@/app/src/types";

interface ToDoProps extends Omit<IToDo, "_id"> {
    id: string;
    toggleComplete: () => void;
    updateMode: (id: string, text: string, complete: boolean) => void;
    deleteToDo: () => void;
    borderColor?: string;
}

const ToDo: React.FC<ToDoProps> = ({
    id,
    text,
    complete,
    deadline,
    toggleComplete,
    updateMode,
    deleteToDo,
    borderColor,
}) => {
    const isExpired =
        Boolean(deadline) && !complete && new Date(deadline!) < new Date();

    return (
        <div
            className={`flex items-center justify-between p-4 rounded-xl border transition
        ${borderColor ?? "border-gray-300"}
        dark:bg-gray-800 dark:border-gray-600
        bg-gray-100
        ${complete ? "opacity-70" : "hover:shadow-md"}
      `}
        >
            {/* LEFT */}
            <div className="flex items-start flex-grow">
                {/* ✅ TOGGLE CHỈ Ở ICON */}
                <button
                    onClick={toggleComplete}
                    disabled={complete}
                    className={`mr-4 text-xl transition
            ${complete
                            ? "text-green-500 cursor-default"
                            : isExpired
                                ? "text-red-500 hover:scale-110"
                                : "text-gray-500 hover:text-blue-500 hover:scale-110"
                        }
          `}
                >
                    {complete ? <FiCheckCircle /> : <FiCircle />}
                </button>

                {/* TEXT + DEADLINE */}
                <div className="flex flex-col">
                    <span
                        className={`text-lg font-medium
              ${complete
                                ? "line-through text-gray-400"
                                : "text-gray-900 dark:text-gray-100"
                            }
            `}
                    >
                        {text}
                    </span>

                    {deadline && (
                        <span
                            className={`text-sm mt-1
                ${complete
                                    ? "text-gray-400"
                                    : isExpired
                                        ? "text-red-600 font-semibold"
                                        : "text-gray-600 dark:text-gray-300"
                                }
              `}
                        >
                            📅 {new Date(deadline).toLocaleDateString()}
                            {!complete && isExpired && " (Quá hạn)"}
                        </span>
                    )}
                </div>
            </div>

            {/* RIGHT */}
            <div className="flex space-x-2 ml-4">
                {/* EDIT */}
                <button
                    disabled={complete}
                    onClick={() => updateMode(id, text, complete)}
                    className={`p-2 rounded-lg transition
            ${complete
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-blue-500 hover:bg-blue-500/10"
                        }
          `}
                >
                    <BiEdit className="text-xl" />
                </button>

                {/* ✅ DELETE LUÔN BẤM ĐƯỢC */}
                <button
                    onClick={deleteToDo}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 active:scale-95 transition"
                >
                    <AiFillDelete className="text-xl" />
                </button>
            </div>
        </div>
    );
};

export default ToDo;
