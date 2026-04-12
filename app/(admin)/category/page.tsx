'use client';

import Modal from '@/components/Modal';
import Input from '@/components/ui/Input';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Category {
    id: string;
    name: string;
    type: string;
    description: string;
    sub_categories?: any[];
}

interface SubCategory {
    id: string;
    name: string;
    description: string;
    category_id: string;
    category?: Category;
    Category?: Category;
}

export default function UnifiedCategoryPage() {
    // Shared State
    const [activeTab, setActiveTab] = useState<'category' | 'subcategory'>('category');
    const [isLoading, setIsLoading] = useState(false);
    
    // Category State
    const [categories, setCategories] = useState<Category[]>([]);
    const [totalCategory, setTotalCategory] = useState(0);

    // Subcategory State
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [totalSubCategory, setTotalSubCategory] = useState(0);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;
    
    const currentList = activeTab === 'category' ? categories : subCategories;
    const totalPages = Math.max(1, Math.ceil(currentList.length / itemsPerPage));
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = currentList.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        // Reset page when tab changes
        setCurrentPage(1);
    }, [activeTab]);

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit' | 'delete'>('create');
    const [modalTarget, setModalTarget] = useState<'category' | 'subcategory'>('category');
    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: '', type: '', description: '', category_id: '' });
    const [errorMsg, setErrorMsg] = useState('');

    // --- API Calls ---
    
    const fetchCategories = async () => {
        try {
            const res = await axios.get('http://localhost:5000/category', { withCredentials: true });
            setCategories(res.data.data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const fetchTotalCategory = async () => {
        try {
            const res = await axios.get('http://localhost:5000/category/info-category', { withCredentials: true });
            setTotalCategory(res.data.totalCategory);
        } catch (error) {
            console.error('Failed to fetch total category:', error);
        }
    };

    const fetchSubCategories = async () => {
        try {
            const res = await axios.get('http://localhost:5000/sub-categories', { withCredentials: true });
            setSubCategories(res.data.data);
        } catch (error) {
            console.error('Failed to fetch sub categories:', error);
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
        fetchCategories();
        fetchTotalCategory();
        fetchSubCategories();
        fetchTotalSubCategory();
    }, []);

    // --- Pagination Logic ---

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

    // --- Modal Handlers ---

    const handleOpenCreateModal = (target: 'category' | 'subcategory') => {
        setModalTarget(target);
        setModalMode('create');
        setFormData({ name: '', type: '', description: '', category_id: '' });
        setErrorMsg('');
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item: any, target: 'category' | 'subcategory') => {
        setModalTarget(target);
        setModalMode('edit');
        setEditId(item.id);
        
        if (target === 'category') {
            setFormData({ name: item.name, type: item.type, description: item.description || '', category_id: '' });
        } else {
            setFormData({ name: item.name, type: '', description: item.description || '', category_id: String(item.category_id) });
        }
        
        setErrorMsg('');
        setIsModalOpen(true);
    };

    const handleOpenDeleteModal = (id: string, target: 'category' | 'subcategory') => {
        setModalTarget(target);
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
        setFormData({ name: '', type: '', description: '', category_id: '' });
        setErrorMsg('');
    };

    const handleSubmit = async () => {
        setErrorMsg('');
        
        // Validation
        if (modalMode !== 'delete') {
            if (modalTarget === 'category' && (!formData.name || !formData.type)) {
                setErrorMsg('Name and Type are required.');
                return;
            }
            if (modalTarget === 'subcategory' && (!formData.name || !formData.category_id)) {
                setErrorMsg('Name and Category are required.');
                return;
            }
        }

        setIsLoading(true);
        try {
            if (modalTarget === 'category') {
                if (modalMode === 'create') {
                    await axios.post('http://localhost:5000/category', { name: formData.name, type: formData.type, description: formData.description }, { withCredentials: true });
                } else if (modalMode === 'edit' && editId) {
                    await axios.put(`http://localhost:5000/category/${editId}`, { name: formData.name, type: formData.type, description: formData.description }, { withCredentials: true });
                } else if (modalMode === 'delete' && editId) {
                    await axios.delete(`http://localhost:5000/category/${editId}`, { withCredentials: true });
                    if (currentItems.length === 1 && currentPage > 1) setCurrentPage(currentPage - 1);
                }
                fetchCategories();
                fetchTotalCategory();
            } else {
                if (modalMode === 'create') {
                    await axios.post('http://localhost:5000/sub-categories', { name: formData.name, category_id: formData.category_id, description: formData.description }, { withCredentials: true });
                } else if (modalMode === 'edit' && editId) {
                    await axios.put(`http://localhost:5000/sub-categories/${editId}`, { name: formData.name, category_id: formData.category_id, description: formData.description }, { withCredentials: true });
                } else if (modalMode === 'delete' && editId) {
                    await axios.delete(`http://localhost:5000/sub-categories/${editId}`, { withCredentials: true });
                    if (currentItems.length === 1 && currentPage > 1) setCurrentPage(currentPage - 1);
                }
                fetchSubCategories();
                fetchTotalSubCategory();
            }
            
            setIsModalOpen(false);
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

    // --- Renders ---

    return (
        <div className="h-full relative overflow-hidden flex flex-col">
            {/* Modal Components */}
            {isModalOpen && (
                <Modal
                    closeButton={() => setIsModalOpen(false)}
                    resetButton={handleReset}
                    submitButton={handleSubmit}
                    title={modalMode === 'create' ? `Create ${modalTarget === 'category' ? 'Category' : 'Sub Category'}` : modalMode === 'edit' ? `Edit ${modalTarget === 'category' ? 'Category' : 'Sub Category'}` : `Delete ${modalTarget === 'category' ? 'Category' : 'Sub Category'}`}>
                    
                    {modalMode === 'delete' ? (
                        <div className="flex flex-col gap-4 pb-4">
                            {errorMsg && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm relative">{errorMsg}</div>
                            )}
                            <p className="text-gray-700 mt-2">
                                Are you sure you want to delete this {modalTarget === 'category' ? 'category' : 'sub category'}? This action cannot be undone.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 pb-4">
                            {errorMsg && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm relative">{errorMsg}</div>
                            )}
                            
                            <Input 
                                label={`${modalTarget === 'category' ? 'Category' : 'Sub Category'} Name`} 
                                placeholder={modalTarget === 'category' ? "e.g. Food & Beverage" : "e.g. Food"}
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                            
                            {modalTarget === 'category' ? (
                                <div className="flex flex-col gap-1 w-full">
                                    <label className="text-sm font-medium text-gray-700">Type</label>
                                    <select 
                                        className="w-full border rounded-md px-3 py-2 text-sm outline-none border-gray-300 focus:border-blue-500 bg-white"
                                        value={formData.type}
                                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                                    >
                                        <option value="" disabled>Select Type</option>
                                        <option value="INCOME">Income</option>
                                        <option value="EXPENSE">Expense</option>
                                    </select>
                                </div>
                            ) : (
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
                            )}

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

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto pl-8 pr-4 py-6 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
                {/* Header Section */}
                <div>
                    <h1 className="text-[28px] font-bold text-[#2d2d2d] leading-none mb-2">Hello, Sarah!</h1>
                    <p className="text-[#8c8c8c] text-[15px]">Traces of your saving adventure today</p>
                </div>
                
                {/* Statistics Cards */}
                <div className="flex items-center gap-6 mt-6">
                    {/* Category Card */}
                    <div className="w-1/2 bg-[#F3F3F3] rounded-2xl p-6 relative">
                        <div className="flex items-center justify-between mb-8">
                            <p className="font-medium text-[#7a7a7a]">Total Category</p>
                            <button 
                                onClick={() => handleOpenCreateModal('category')}
                                className="w-7 h-7 bg-[#3B3B3B] hover:bg-black transition-colors rounded-lg flex items-center justify-center text-white text-lg font-light leading-none"
                            >
                                +
                            </button>
                        </div>
                        <div>
                            <p className="text-[40px] font-medium leading-none mb-3 text-[#2d2d2d]">{isLoading ? '...' : totalCategory}</p>
                            <div className="inline-block bg-gray-300 px-3 py-1.5 rounded-lg">
                                <p className="text-[13px] text-[#494949] font-medium">Last Added : 1 Days Ago</p>
                            </div>
                        </div>
                    </div>

                    {/* Sub Category Card */}
                    <div className="w-1/2 bg-[#F3F3F3] rounded-2xl p-6 relative">
                        <div className="flex items-center justify-between mb-8">
                            <p className="font-medium text-[#7a7a7a]">Total Sub Category</p>
                            <button 
                                onClick={() => handleOpenCreateModal('subcategory')}
                                className="w-7 h-7 bg-[#3B3B3B] hover:bg-black transition-colors rounded-lg flex items-center justify-center text-white text-lg font-light leading-none"
                            >
                                +
                            </button>
                        </div>
                        <div>
                            <p className="text-[40px] font-medium leading-none mb-3 text-[#2d2d2d]">{isLoading ? '...' : totalSubCategory}</p>
                            <div className="inline-block bg-gray-300 px-3 py-1.5 rounded-lg">
                                <p className="text-[13px] text-[#494949] font-medium">Last Added : 1 Days Ago</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Switch & Action Bar */}
                <div className="flex items-center justify-between mt-8 mb-4">
                    {/* Switch Tab Component */}
                    <div className="flex items-center border border-[#E5E5E5] rounded-lg p-0.5 bg-white">
                        <button 
                            className={`px-8 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'category' ? 'bg-gray-100 text-[#2d2d2d] ' : 'text-[#8c8c8c] hover:bg-gray-50'}`}
                            onClick={() => setActiveTab('category')}
                        >
                            Category
                        </button>
                        <button 
                            className={`px-8 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'subcategory' ? 'bg-gray-100 text-[#2d2d2d] ' : 'text-[#8c8c8c] hover:bg-gray-50'}`}
                            onClick={() => setActiveTab('subcategory')}
                        >
                            Sub Category
                        </button>
                    </div>

                    {/* Right side empty space / action bar */}
                    <div className="flex items-center">
                        <input
                            type="text"
                            placeholder="Search"
                            className="bg-[#F9F9F9] border border-[#E5E5E5] text-sm px-4 py-2.5 rounded-lg w-64 outline-none focus:border-gray-400 transition-colors"
                        />
                    </div>
                </div>

                {/* Table Area wrapped in Card */}
                <div className="bg-[#F8F8F8] rounded-2xl p-6 mt-4">
                    <h2 className="text-[15px] font-medium text-[#7a7a7a] mb-4 pb-4 border-b border-[#E5E5E5]">
                        Table {activeTab === 'category' ? 'Category' : 'Sub Category'}
                    </h2>
                    
                    <div className="pt-2">
                        <table className="w-full text-left border-collapse table-fixed">
                            <thead>
                                <tr className="text-[#8c8c8c] text-sm font-normal border-b border-[#E5E5E5]">
                                    {activeTab === 'category' ? (
                                        <>
                                            <th className="py-3 px-4 w-[25%] font-medium">Name</th>
                                            <th className="py-3 px-4 w-[35%] font-medium">Description</th>
                                            <th className="py-3 px-4 text-center w-[15%] font-medium">Sub Categories</th>
                                            <th className="py-3 px-4 text-center w-[15%] font-medium">Type</th>
                                            <th className="py-3 px-4 text-center w-[10%] font-medium">Action</th>
                                        </>
                                    ) : (
                                        <>
                                            <th className="py-3 px-4 w-[40%] font-medium">Name</th>
                                            <th className="py-3 px-4 w-[40%] font-medium">Category</th>
                                            <th className="py-3 px-4 text-center w-[20%] font-medium">Action</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.length > 0 ? currentItems.map((item: any) => (
                                    <tr
                                        key={item.id}
                                        className="border-b border-[#E5E5E5] last:border-none text-sm group transition-colors">
                                        
                                        {activeTab === 'category' ? (
                                            <>
                                                <td className="py-4 px-4 font-medium text-[#2d2d2d]">{item.name}</td>
                                                <td className="py-4 px-4 text-[#8c8c8c] truncate max-w-[200px]" title={item.description || ''}>{item.description || '-'}</td>
                                                <td className="py-4 px-4 text-center text-[#8c8c8c]">{item.sub_categories ? item.sub_categories.length : 0}</td>
                                                <td className="py-4 px-4 text-center">
                                                    <span className={`px-3 py-1 text-[11px] font-medium tracking-wider rounded-md ${
                                                        (item.type || '').toUpperCase() === 'INCOME' 
                                                        ? 'bg-[#EAF5E5] text-[#2c7a2c]' 
                                                        : (item.type || '').toUpperCase() === 'EXPENSE' 
                                                        ? 'bg-[#FDECEC] text-[#c93b3b]' 
                                                        : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                        {item.type ? item.type.toUpperCase() : '-'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center justify-center gap-2 text-[#8c8c8c]">
                                                        <button 
                                                            onClick={() => handleOpenEditModal(item, 'category')}
                                                            className="hover:text-[#2d2d2d] transition-colors p-1 rounded-md"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                                        </button>
                                                        <button 
                                                            onClick={() => handleOpenDeleteModal(item.id, 'category')}
                                                            className="hover:text-red-500 transition-colors p-1 rounded-md"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="py-4 px-4 font-medium text-[#2d2d2d]">{item.name}</td>
                                                <td className="py-4 px-4 text-[#8c8c8c]">
                                                    {categories.find(c => String(c.id) === String(item.category_id) || String(c.id) === String((item as any).categoryId))?.name || item.category?.name || item.Category?.name || '-'}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center justify-center gap-2 text-[#8c8c8c]">
                                                        <button 
                                                            onClick={() => handleOpenEditModal(item, 'subcategory')}
                                                            className="hover:text-[#2d2d2d] transition-colors p-1 rounded-md"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                                        </button>
                                                        <button 
                                                            onClick={() => handleOpenDeleteModal(item.id, 'subcategory')}
                                                            className="hover:text-red-500 transition-colors p-1 rounded-md"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-[#8c8c8c]">
                                            {isLoading ? "Loading..." : `No ${activeTab === 'category' ? 'categories' : 'sub categories'} found.`}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-6 text-sm text-[#8c8c8c]">
                        <div>
                            Showing: <span className="font-medium text-[#2d2d2d]">{currentItems.length}</span> Of {currentList.length}
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="w-8 h-8 flex items-center justify-center hover:bg-[#ebebeb] rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                &lt;
                            </button>
                            {generatePagination().map((page, index) => (
                                <button
                                    key={index}
                                    onClick={() => typeof page === 'number' ? goToPage(page) : undefined}
                                    className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${Math.floor(currentPage) === page ? 'bg-white shadow-sm border border-[#E5E5E5] text-[#2d2d2d] font-medium' : typeof page === 'number' ? 'hover:bg-[#ebebeb]' : 'cursor-default'}`}>
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className="w-8 h-8 flex items-center justify-center hover:bg-[#ebebeb] rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                &gt;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
