'use client';

import Modal from '@/components/Modal';
import Input from '@/components/ui/Input';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Category {
    id: string;
    name: string;
    type: string;
}

interface SubCategory {
    id: string;
    name: string;
    description: string;
    category_id: string;
    category?: Category;
    Category?: Category;
}

export default function SubCategoryPage() {
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [totalSubCategory, setTotalSubCategory] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const totalPages = Math.ceil(subCategories.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = subCategories.slice(indexOfFirstItem, indexOfLastItem);

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit' | 'delete'>('create');
    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '', category_id: '' });
    const [errorMsg, setErrorMsg] = useState('');

    const fetchSubCategories = async () => {
        try {
            const res = await axios.get('http://localhost:5000/sub-categories', { withCredentials: true });
            setSubCategories(res.data.data);
        } catch (error) {
            console.error('Failed to fetch sub categories:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get('http://localhost:5000/category', { withCredentials: true });
            setCategories(res.data.data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const fetchTotalSubCategory = async () => {
        try {
            const res = await axios.get('http://localhost:5000/sub-categories/info-subcategory', { withCredentials: true });
            setTotalSubCategory(res.data.totalSubCategory);
        } catch (error) {
            console.error('Failed to fetch total sub category:', error);
        }
    };

    useEffect(() => {
        fetchSubCategories();
        fetchCategories();
        fetchTotalSubCategory();
    }, []);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const generatePagination = () => {
        if (totalPages <= 6) return Array.from({ length: totalPages }).map((_, i) => i + 1);
        if (currentPage <= 3) return [1, 2, 3, '...', totalPages - 1, totalPages];
        if (currentPage >= totalPages - 2)
            return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
        return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    };

    const handleOpenCreateModal = () => {
        setModalMode('create');
        setFormData({ name: '', description: '', category_id: '' });
        setErrorMsg('');
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (subCategory: SubCategory) => {
        setModalMode('edit');
        setEditId(subCategory.id);
        setFormData({ 
            name: subCategory.name, 
            description: subCategory.description || '',
            category_id: String(subCategory.category_id)
        });
        setErrorMsg('');
        setIsModalOpen(true);
    };

    const handleOpenDeleteModal = (id: string) => {
        setModalMode('delete');
        setEditId(id);
        setErrorMsg('');
        setIsModalOpen(true);
    };

    const handleReset = () => {
        if (modalMode === 'delete') {
            setIsModalOpen(false);
            return;
        }
        setFormData({ name: '', description: '', category_id: '' });
        setErrorMsg('');
    };

    const handleSubmit = async () => {
        setErrorMsg('');
        if (modalMode !== 'delete' && (!formData.name || !formData.category_id)) {
            setErrorMsg('Name and Category are required.');
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                ...formData
            };

            if (modalMode === 'create') {
                await axios.post('http://localhost:5000/sub-categories', payload, { withCredentials: true });
            } else if (modalMode === 'edit' && editId) {
                await axios.put(`http://localhost:5000/sub-categories/${editId}`, payload, { withCredentials: true });
            } else if (modalMode === 'delete' && editId) {
                await axios.delete(`http://localhost:5000/sub-categories/${editId}`, { withCredentials: true });
                
                // Adjust pagination if deleting last item on page
                if (currentItems.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                }
            }
            
            setIsModalOpen(false);
            fetchSubCategories();
            fetchTotalSubCategory();
        } catch (err: any) {
            if (err.response && err.response.data) {
                setErrorMsg(err.response.data.error || err.response.data.message || 'An error occurred');
            } else {
                setErrorMsg('Failed to connect to server.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isModalOpen && (
                <Modal
                    closeButton={() => setIsModalOpen(false)}
                    resetButton={handleReset}
                    submitButton={handleSubmit}
                    title={modalMode === 'create' ? "Create Sub Category" : modalMode === 'edit' ? "Edit Sub Category" : "Delete Sub Category"}>
                    {modalMode === 'delete' ? (
                        <div className="flex flex-col gap-4 pb-4">
                            {errorMsg && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm relative">
                                    {errorMsg}
                                </div>
                            )}
                            <p className="text-gray-700 mt-2">
                                Are you sure you want to delete this sub category? This action cannot be undone.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 pb-4">
                            {errorMsg && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm relative">
                                    {errorMsg}
                                </div>
                            )}
                            <Input 
                                label="Sub Category Name" 
                                placeholder="e.g. Food"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                            <div className="flex flex-col gap-1 w-full">
                                <label className="text-sm font-medium text-gray-700">Category</label>
                                <select 
                                    className="w-full border rounded-md px-3 py-2 text-sm outline-none border-gray-300 focus:border-blue-500 bg-white"
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                                >
                                    <option value="" disabled>Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name} ({cat.type})</option>
                                    ))}
                                </select>
                            </div>
                            <Input 
                                label="Description" 
                                placeholder="Short description here..."
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            />
                        </div>
                    )}
                </Modal>
            )}

            <div className="h-[calc(100%-2rem)] overflow-y-auto pl-8 pr-4 my-4 mr-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
                <div>
                    <h1 className="text-4xl font-bold">Sub Category</h1>
                    <p className="">Manage Your Sub Category Here</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="my-6 outline-[#BEBEBE] outline-1 w-4/12 h-26 px-4.5 py-3.5 rounded-xl">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <div className="size-4 bg-blue-600 rounded-full"></div>
                                <p className="font-medium text-[#646464] text-lg leading-none">
                                    Total Sub Category
                                </p>
                            </div>
                            <div>
                                <p className="text-4xl font-semibold mt-4">{isLoading ? '...' : totalSubCategory}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center w-full justify-between">
                    <button 
                        onClick={handleOpenCreateModal}
                        className="outline text-sm px-4 py-2 rounded-lg outline-[#BEBEBE] hover:bg-gray-50 flex items-center justify-center cursor-pointer transition-colors"
                    >
                        Add Sub Category
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <select
                                className="appearance-none outline-[#BEBEBE] outline-1 px-4 pr-10 py-2 rounded-lg text-sm bg-white hover:bg-gray-50 transition-colors cursor-pointer w-full text-gray-700">
                                <option value="">By Category</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Search"
                                className="outline-[#BEBEBE] outline-1 text-sm px-4 py-2 rounded-lg"
                            />
                        </div>
                    </div>
                </div>
                
                <div className="mt-6">
                    <table className="w-full text-left border-collapse table-fixed">
                        <thead>
                            <tr className="bg-[#F3F4F6] text-[#2d2d2d] text-sm font-semibold">
                                <th className="py-3 px-4 rounded-tl-xl w-[40%] border-b border-gray-100">Name</th>
                                <th className="py-3 px-4 w-[40%] border-b border-gray-100">Category</th>
                                <th className="py-3 px-4 text-center rounded-tr-xl w-[20%] border-b border-gray-100">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? currentItems.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-b border-gray-100 last:border-none text-sm hover:bg-gray-50/50 transition-colors group">
                                    <td className="py-4 px-4 font-semibold text-gray-900">{item.name}</td>
                                    <td className="py-4 px-4 text-gray-600 font-medium">
                                        {categories.find(c => String(c.id) === String(item.category_id) || String(c.id) === String((item as any).categoryId))?.name || item.category?.name || item.Category?.name || '-'}
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center justify-center gap-2 text-gray-500">
                                            <button 
                                                onClick={() => handleOpenEditModal(item)}
                                                className="hover:text-blue-600 transition-colors bg-transparent p-1.5 rounded-md cursor-pointer"
                                                title="Edit Sub Category"
                                            >
                                                <svg className="size-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                </svg>
                                            </button>
                                            <button 
                                                onClick={() => handleOpenDeleteModal(item.id)}
                                                className="hover:text-red-600 transition-colors bg-transparent p-1.5 rounded-md cursor-pointer"
                                                title="Delete Sub Category"
                                            >
                                                <svg className="size-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={3} className="py-8 text-center text-gray-500 bg-gray-50/30 rounded-b-xl">
                                        {isLoading ? "Loading..." : "No sub categories found. Click 'Add Sub Category' to get started."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {subCategories.length > 0 && (
                        <div className="flex items-center justify-between mt-8 text-sm text-[#646464]">
                            <div>
                                Showing:{' '}
                                <span className="font-bold text-black">{currentItems.length}</span> Of{' '}
                                {subCategories.length}
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors">
                                    &lt;
                                </button>

                                {generatePagination().map((page, index) => (
                                    <button
                                        key={index}
                                        onClick={() => typeof page === 'number' ? goToPage(page) : undefined}
                                        className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${Math.floor(currentPage) === page ? 'border border-[#BEBEBE] text-black font-medium cursor-default shadow-sm' : typeof page === 'number' ? 'hover:bg-gray-50 cursor-pointer' : 'cursor-default'}`}>
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors">
                                    &gt;
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
