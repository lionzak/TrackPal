import React from 'react'

const AddBudgetCategoryModal = ({ isAddCategoryModalOpen, setIsAddCategoryModalOpen, newCategory, setNewCategory, handleAddCategory }: { isAddCategoryModalOpen: boolean; setIsAddCategoryModalOpen: React.Dispatch<React.SetStateAction<boolean>>; newCategory: { category: string; budget: number }; setNewCategory: React.Dispatch<React.SetStateAction<{ category: string; budget: number }>>; handleAddCategory: () => void; }) => {
    return (
        <>
            {isAddCategoryModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 text-black">
                    <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
                        <h3 className="text-lg font-bold mb-4">Add New Category</h3>
                        <label htmlFor="category">Category Name</label>
                        <input
                            type="text"
                            placeholder="Category Name"
                            value={newCategory.category}
                            onChange={(e) => setNewCategory({ ...newCategory, category: e.target.value })}
                            className="border border-gray-300 rounded-lg py-2 px-3 w-full mb-3 placeholder:text-gray-400"
                        />
                        <label htmlFor="budget">Total Budget</label>
                        <input
                            type="number"
                            placeholder="Total Budget"
                            value={newCategory.budget}
                            onChange={(e) => setNewCategory({ ...newCategory, budget: Number(e.target.value) })}
                            className="border border-gray-300 rounded-lg py-2 px-3 w-full mb-4"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsAddCategoryModalOpen(false)}
                                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddCategory}
                                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default AddBudgetCategoryModal
