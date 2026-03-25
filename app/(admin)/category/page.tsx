'use client';

import { useState } from 'react';

const DUMMY_DATA = Array.from({ length: 150 }).map((_, i) => ({
    id: i + 1,
    name: `LifeStyle ${i + 1}`,
    subCategories: Math.floor(Math.random() * 5) + 1,
    type: i % 3 === 0 ? 'Expense' : 'Income',
}));

export default function Category() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const totalItems = DUMMY_DATA.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = DUMMY_DATA.slice(indexOfFirstItem, indexOfLastItem);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const generatePagination = () => {
        if (totalPages <= 6) return Array.from({ length: totalPages }).map((_, i) => i + 1);
        if (currentPage <= 3) return [1, 2, 3, '...', totalPages - 1, totalPages];
        if (currentPage >= totalPages - 2) return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
        return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    };

    return (
        <>
            <div className="h-[calc(100%-2rem)] overflow-y-auto pl-8 pr-4 my-4 mr-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
                <div>
                    <h1 className="text-4xl font-bold">Category</h1>
                    <p className="">Manage Your Category Here</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="my-6 outline-[#BEBEBE] outline-1 w-4/12 h-26 px-4.5 py-3.5 rounded-xl">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <div className="size-4 bg-blue-600 rounded-full"></div>
                                <p className="font-medium text-[#646464] text-lg leading-none">
                                    Total Category
                                </p>
                            </div>
                            <div>
                                <p className="text-4xl font-semibold mt-4">12</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center w-full justify-between">
                    <button className="outline text-sm px-4 py-2 rounded-lg outline-[#BEBEBE]">
                        Add Category
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <select
                                name=""
                                id=""
                                className="appearance-none outline-[#BEBEBE] outline-1 px-4 pr-10 py-2 rounded-lg text-sm bg-white hover:bg-gray-50 transition-colors cursor-pointer w-full text-gray-700">
                                <option value="">By Type</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                <svg
                                    className="size-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Search"
                                className=" outline-[#BEBEBE] outline-1 text-sm px-4 py-2 rounded-lg"
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-6">
                    <table className="w-full text-left border-collapse table-fixed">
                        <thead>
                            <tr className="bg-[#F3F4F6] text-[#2d2d2d] text-sm font-semibold">
                                <th className="py-3 px-4 rounded-tl-xl w-2/5">Name</th>
                                <th className="py-3 px-4 text-center w-1/5">Sub Categories</th>
                                <th className="py-3 px-4 text-center w-1/5">Type</th>
                                <th className="py-3 px-4 text-center rounded-tr-xl w-1/5">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item) => (
                                <tr key={item.id} className="border-b border-gray-100 last:border-none text-sm font-medium text-[#646464]">
                                    <td className="py-4 px-4">{item.name}</td>
                                    <td className="py-4 px-4 text-center">{item.subCategories}</td>
                                    <td className="py-4 px-4 text-center">{item.type}</td>
                                    <td className="py-4 px-4 flex justify-center gap-3 text-gray-500">
                                        <button className="hover:text-blue-600 transition-colors">
                                            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                            </svg>
                                        </button>
                                        <button className="hover:text-red-500 transition-colors">
                                            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex items-center justify-between mt-8 text-sm text-[#646464]">
                        <div>
                            Showing: <span className="font-bold text-black">{currentItems.length}</span> Of {totalItems.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                            <button 
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed">
                                &lt;
                            </button>
                            
                            {generatePagination().map((page, index) => (
                                <button 
                                    key={index}
                                    onClick={() => typeof page === 'number' ? goToPage(page) : undefined}
                                    className={`w-8 h-8 flex items-center justify-center rounded ${Math.floor(currentPage) === page ? 'border border-[#BEBEBE] text-black font-medium' : typeof page === 'number' ? 'hover:bg-gray-50' : 'cursor-default'}`}>
                                    {page}
                                </button>
                            ))}
                            
                            <button 
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed">
                                &gt;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
