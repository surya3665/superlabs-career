import { useEffect, useRef, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Edit, Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const categoryUrl = import.meta.env.VITE_CATEGORY_URL;

const AddCategory = ({ onClose, onSubmit, editData, existingCategories }) => {
  const [categoryName, setCategoryName] = useState(
    editData ? editData.category_title : ""
  );
  const [errors, setErrors] = useState({});
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!categoryName.trim()) {
      newErrors.categoryName = "Category name is required";
    } else if (
      existingCategories.some(
        (category) =>
          category.category_title?.toLowerCase() === categoryName?.toLowerCase()
      )
    ) {
      newErrors.categoryName = "Category name already exists";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editData && editData.category_id) {
      axios
        .put(`${categoryUrl}/${editData.category_id}`, {
          category_title: categoryName,
        })
        .then((res) => {
          onSubmit(res.data, "update");
          onClose();
          toast.success("Category updated successfully!");
        })
        .catch((err) => console.log("Error updating category:", err));
    } else {
      axios
        .post(categoryUrl, { category_title: categoryName })
        .then((res) => {
          onSubmit(res.data, "add");
          setCategoryName("");
          toast.success("Category added successfully!");
        })
        .catch((err) => console.log("Error adding category:", err));
    }
  };

  return (
    <div className="p-4 border bg-white rounded-lg shadow-md w-full mx-auto">
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 text-lg font-semibold text-gray-700">
          {editData ? "Edit Category" : "Add Category"}{" "}
          <span className="text-red-500">*</span>
        </label>
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter Category"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="border p-2 rounded-md w-full mb-4 outline-none focus:ring-2 focus:ring-blue-300"
        />
        {errors.categoryName && (
          <p className="text-red-500 text-sm">{errors.categoryName}</p>
        )}
        <div className="flex gap-3 justify-end">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            {editData ? "Update" : "Submit"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [categoryForm, setCategoryForm] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    axios
      .get(categoryUrl)
      .then((res) => {
        setCategories(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  };

  const handleFormSubmit = (updatedCategory, action) => {
    if (action === "add") {
      setCategories([...categories, updatedCategory]);
    } else if (action === "update") {
      setCategories(
        categories.map((cat) =>
          cat.category_id === updatedCategory.category_id
            ? updatedCategory
            : cat
        )
      );
    }
    setCategoryForm(false);
    setEditData(null);
  };

  const handleEdit = (category) => {
    setEditData(category);
    setCategoryForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      axios
        .delete(`${categoryUrl}/${id}`)
        .then(() => {
          setCategories(categories.filter((cat) => cat.category_id !== id));
          toast.success("Category deleted successfully!");
        })
        .catch((err) => console.error("Error deleting category:", err));
    }
  };

  return (
    <main className="flex flex-col items-center w-full px-6 ">
      <ToastContainer />
      <div className="w-full  bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center pb-4 border-b">
          <h1 className="text-2xl font-bold text-gray-700">Categories</h1>
          <button
            onClick={() => {
              setEditData(null);
              setCategoryForm(true);
            }}
            className="text-sm font-medium border bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            + Add Category
          </button>
        </div>

        {categoryForm && (
          <AddCategory
            onClose={() => setCategoryForm(false)}
            onSubmit={handleFormSubmit}
            editData={editData}
            existingCategories={categories}
          />
        )}

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-full border-collapse">
            <thead className="bg-gray-100">
              <tr className="text-sm font-semibold text-gray-700">
                <th className="py-3 px-4 border text-start">S.No</th>
                <th className="py-3 px-4 border text-start">Category</th>
                <th className="py-3 px-4 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <tr
                    key={category.category_id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">{category.category_title}</td>
                    <td className="py-3 px-4 flex justify-center gap-4">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(category.category_id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-4 text-center text-gray-500">
                    No categories available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

AddCategory.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  editData: PropTypes.shape({
    category_id: PropTypes.number,
    category_title: PropTypes.string,
  }),
  existingCategories: PropTypes.arrayOf(
    PropTypes.shape({
      category_id: PropTypes.number,
      category_title: PropTypes.string,
    })
  ).isRequired,
};

export default Category;