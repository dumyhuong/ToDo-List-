"use client";

import React, { useEffect, useState } from "react";
import ToDo from "./src/components/ToDo";
import ThemeToggle from "./src/components/ThemeToggle";
import LoginPage from "./src/components/LoginPage";
import { IToDo } from "./src/types";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAllToDo,
  addToDo,
  updateToDo,
  deleteToDo,
  updateComplete,
} from "./src/utils/HandleApi";
import { useTheme } from "./src/utils/ThemeContext";

export default function Home() {
  const { theme } = useTheme();

  /* ---------- STATE ---------- */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [todos, setTodos] = useState<IToDo[]>([]);
  const [text, setText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [originalText, setOriginalText] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] =
    useState<"delete" | "update" | null>(null);

  /* Search / Filter / Sort */
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"all" | "complete" | "incomplete">("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  /* ---------- FETCH TODO ---------- */
  useEffect(() => {
    if (isLoggedIn) {
      getAllToDo(setTodos);
    }
  }, [isLoggedIn]);

  /* ---------- LOGIN ---------- */
  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  /* ---------- HELPERS ---------- */
  const resetForm = () => {
    setText("");
    setIsUpdating(false);
    setCurrentId("");
    setOriginalText("");
  };

  const handleSubmit = () => {
    if (!text.trim()) return;

    if (isUpdating) {
      if (text.trim() === originalText.trim()) {
        resetForm();
        return;
      }
      updateToDo(currentId, text, setTodos, setText, setIsUpdating);
    } else {
      addToDo(text, setText, setTodos);
    }
    resetForm();
  };

  const handleUpdateMode = (
    id: string,
    text: string,
    complete: boolean
  ) => {
    if (complete) return;
    setIsUpdating(true);
    setCurrentId(id);
    setText(text);
    setOriginalText(text);
  };

  const handleToggleComplete = (id: string, complete: boolean) => {
    setTodos(prev =>
      prev.map(t =>
        t._id === id ? { ...t, complete: !complete } : t
      )
    );
    updateComplete(id, !complete, setTodos);
  };

  /* ---------- SEARCH / FILTER / SORT (SAFE) ---------- */
  const filteredTodos = todos
    .filter(todo =>
      todo.text.toLowerCase().includes(searchText.toLowerCase())
    )
    .filter(todo => {
      if (statusFilter === "all") return true;
      if (statusFilter === "complete") return todo.complete;
      return !todo.complete;
    })
    .sort((a, b) => {
      const timeA = a.deadline
        ? new Date(a.deadline).getTime()
        : Infinity;
      const timeB = b.deadline
        ? new Date(b.deadline).getTime()
        : Infinity;

      return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
    });

  const borderColors = [
    "border-blue-400",
    "border-cyan-400",
    "border-lime-400",
    "border-orange-400",
    "border-pink-400",
  ];

  /* ---------- UI ---------- */
  return (
    <div
      className={`min-h-screen flex justify-center transition-colors ${theme === "dark" ? "bg-black text-white" : "bg-gray-100 text-black"
        }`}
    >
      <div className="w-full max-w-5xl px-6 pt-12 pb-16 relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-blue-500">
            TODO LIST
          </h1>
          <p className="opacity-80 mt-2">
            ({todos.filter(t => t.complete).length}/{todos.length} hoàn thành)
          </p>
        </header>

        {/* Search / Filter / Sort */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <input
            placeholder="Tìm kiếm..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="flex-1 p-3 rounded-lg border"
          />

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className={`p-3 rounded-lg border outline-none
                ${theme === "dark"
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-gray-800 border-gray-300"}
            `}
          >
            <option className="text-blue" value="all">Tất cả</option>
            <option className="text-blue" value="complete">Hoàn thành</option>
            <option className="text-blue" value="incomplete">Chưa hoàn thành</option>
          </select>


          <select
            value={sortOrder}
            onChange={e =>
              setSortOrder(e.target.value as "asc" | "desc")
            }
            className={`p-3 rounded-lg border outline-none
              ${theme === "dark"
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-gray-800 border-gray-300"}
            `}
          >
            <option className="text-blue" value="asc">Deadline ↑</option>
            <option className="text-blue" value="desc">Deadline ↓</option>
          </select>
        </div>

        {/* Input */}
        <form
          onSubmit={e => {
            e.preventDefault();
            isUpdating
              ? (setModalAction("update"), setShowModal(true))
              : handleSubmit();
          }}
          className="flex gap-3 mb-8"
        >
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Nhập công việc..."
            className="flex-1 p-3 rounded-lg border"
          />
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg">
            {isUpdating ? "CẬP NHẬT" : "THÊM"}
          </button>
        </form>

        {/* Todo list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredTodos.map((todo, i) => (
            <ToDo
              key={todo._id}
              id={todo._id}
              text={todo.text}
              complete={todo.complete}
              deadline={todo.deadline}
              toggleComplete={() =>
                handleToggleComplete(todo._id, todo.complete)
              }
              updateMode={handleUpdateMode}
              deleteToDo={() => {
                if (todo.complete) {
                  deleteToDo(todo._id, setTodos);
                  return;
                }
                setCurrentId(todo._id);
                setModalAction("delete");
                setShowModal(true);
              }}

              borderColor={borderColors[i % borderColors.length]}
            />
          ))}
        </div>
        {showModal && modalAction === "delete" && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div
              className={`p-6 rounded-xl w-80 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
                }`}
            >
              <p className="mb-6 text-center">
                Bạn có chắc chắn muốn xoá công việc này?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Không
                </button>

                <button
                  onClick={() => {
                    deleteToDo(currentId, setTodos);
                    setShowModal(false);
                  }}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Xoá
                </button>
              </div>
            </div>
          </div>
        )}
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          transition={Bounce}
          theme={theme}
        />
      </div>
    </div>
  );
}
