'use client';

import React, { useState } from 'react';

type WishlistItem = {
  id: number;
  name: string;
  progress: number;
  status: "ON GOING" | "NOT STARTED" | "COMPLETED";
  priority: "URGENT" | "NORMAL";
};

const initialData: WishlistItem[] = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  name: "Blablablablabla",
  progress: 65,
  status: "ON GOING",
  priority: "URGENT",
}));

export default function WishlistPage() {
  const [list, setList] = useState(initialData);
  const [showModal, setShowModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const [newItem, setNewItem] = useState({
    name: "",
    priority: "NORMAL",
  });

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <h1 className="text-2xl font-semibold mb-1">Wishlist</h1>
      <p className="text-gray-500 mb-6">
        Traces of your saving adventure today
      </p>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {["Total", "On Going", "Not Started", "Completed"].map((item) => (
          <div key={item} className="bg-white rounded-lg p-6 flex flex-col justify-between h-42 ">
            <p className="text-gray-400 text-sm">{item}</p>
            <h2 className="text-4xl font-semibold mt-2">{list.length}</h2>
          </div>
        ))}
      </div>

      {/* ACTION */}
      <div className="flex justify-end gap-3 mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-gray-200 px-4 py-2 rounded-lg"
        >
          + Add Wishlist
        </button>

        <button
          onClick={() => setShowFilter(!showFilter)}
          className="bg-gray-200 px-4 py-2 rounded-lg"
        >
          + Filter
        </button>
      </div>

      {/* FILTER */}
      {showFilter && (
        <div className="mb-4 flex gap-2">
          <button
            onClick={() =>
              setList(initialData.filter((i) => i.status === "ON GOING"))
            }
            className="px-3 py-1 bg-green-200 rounded"
          >
            On Going
          </button>

          <button
            onClick={() =>
              setList(initialData.filter((i) => i.priority === "URGENT"))
            }
            className="px-3 py-1 bg-red-200 rounded"
          >
            Urgent
          </button>

          <button
            onClick={() => setList(initialData)}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Reset
          </button>
        </div>
      )}

      {/* LIST */}
      <div className="space-y-1.5">
        {list.map((item) => (
          <div
            key={item.id}
            className="bg-white px-12 py-4 rounded-lg  flex items-center justify-between"
          >
            {/* NAME */}
            <div className="w-1/4">
              <p className="font-medium">{item.name}</p>
            </div>

            {/* PRIORITY */}
            <div className="w-1/6">
              <span className="inline-block w-28 text-center bg-red-200 text-red-600 py-1.5 font-semibold rounded-lg text-[0.65rem]">
                {item.priority}
              </span>
            </div>

            {/* STATUS */}
            <div className="w-1/6">
              <span className="inline-block w-28 text-center bg-green-200 text-green-600 py-1.5 font-semibold rounded-lg text-[0.65rem]">
                {item.status}
              </span>
            </div>

            {/* PROGRESS */}
            <div className="w-1/5 flex items-center gap-3">
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
              <span className="ml-16 text-xs text-black">
                {item.progress}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL ADD */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-80">
            <h2 className="text-lg font-semibold mb-4">Add Wishlist</h2>

            <input
              type="text"
              placeholder="Wishlist name"
              className="w-full border p-2 rounded mb-3"
              value={newItem.name}
              onChange={(e) =>
                setNewItem({ ...newItem, name: e.target.value })
              }
            />

            <select
              className="w-full border p-2 rounded mb-4"
              value={newItem.priority}
              onChange={(e) =>
                setNewItem({ ...newItem, priority: e.target.value })
              }
            >
              <option value="NORMAL">Normal</option>
              <option value="URGENT">Urgent</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  if (!newItem.name) return;

                  setList([
                    ...list,
                    {
                      id: Date.now(),
                      name: newItem.name,
                      progress: 0,
                      status: "NOT STARTED",
                      priority: newItem.priority as any,
                    },
                  ]);

                  setShowModal(false);
                  setNewItem({ name: "", priority: "NORMAL" });
                }}
                className="px-3 py-1 bg-black text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}