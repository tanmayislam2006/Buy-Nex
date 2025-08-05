import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import ImageUpload from "../../../shared/ImageUpload";

const AddProduct = () => {
  const { handleSubmit, register, watch } = useForm();
  const [imageLinks, setImageLinks] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleImageUpload = (files) => {
    files.forEach((file) => {
      const apiKey = import.meta.env.VITE_IMMGBB_API_KEY;
      const formData = new FormData();
      formData.append("image", file);

      axios
        .post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData)
        .then((response) => {
          setImageLinks((prevLinks) => [...prevLinks, response.data.data.url]);
          toast.success("Image uploaded successfully");
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          toast.error("Error uploading image");
        });
    });
  };

  const handleRemoveImage = (index) => {
    setImageLinks((prevLinks) => prevLinks.filter((_, i) => i !== index));
  };

  const onDrop = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
    const files = [...event.dataTransfer.files];
    handleImageUpload(files);
  }, []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(true);
  }, []);

  const onDragLeave = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
  }, []);

  const onFileSelect = (event) => {
    const files = [...event.target.files];
    handleImageUpload(files);
  };

  const onSubmit = (data) => {
    const { length, width, height, unit, tags, ...product } = data;
    product.dimensions = {
      length,
      width,
      height,
      unit,
    };
    product.tags = tags.split(",").map((e) => e.trim());
    product.images = imageLinks;
    console.log(product);
  };

  const tagsValue = watch("tags"); // Watch the textarea for live changes
  const tagsArray = tagsValue
    ?.split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  return (
    <div className="px-4 py-16 md:py-0 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-3xl font-bold mb-4 md:mb-6 text-orange-600">
          Add New Product
        </h1>
        <div className="card bg-base-100 shadow-xl p-4 md:p-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Product Images */}
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text">Product Images</span>
              </label>
              <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                className={`relative group border-2 rounded-lg border-dashed p-4 ${
                  isDragActive ? "border-blue-500" : "border-gray-300"
                }`}
              >
                <input
                  type="file"
                  multiple
                  onChange={onFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex justify-center">
                  <ImageUpload isDragActive={isDragActive}/>
                  </div>
                </label>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {imageLinks.map((link, idx) => (
                  <div key={idx} className="relative">
                    <img
                      className="h-32 w-32 rounded-xl object-cover"
                      src={link}
                      alt="product image"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Product Name</span>
              </label>
              <input
                type="text"
                {...register("productName")}
                placeholder="e.g., Wireless Headphones"
                className="input input-bordered w-full"
              />
            </div>

            {/* Product Price */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Price</span>
              </label>
              <input
                type="number"
                placeholder="e.g., 99.99"
                {...register("price")}
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Currency</span>
              </label>
              <input
                type="text"
                placeholder="e.g., BDT"
                {...register("currency")}
                className="input input-bordered w-full"
              />
            </div>

            {/* Product Category */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <select
                {...register("category")}
                className="select select-bordered w-full"
              >
                <option disabled selected>
                  Select Category
                </option>
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Home & Garden</option>
                <option>Sports</option>
              </select>
            </div>

            {/* SKU */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">SKU</span>
              </label>
              <input
                {...register("sku")}
                type="text"
                placeholder="e.g., WRL-HP-001"
                className="input input-bordered w-full"
              />
            </div>

            {/* Inventory */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Inventory</span>
              </label>
              <input
                {...register("inventory")}
                type="number"
                placeholder="e.g., 150"
                className="input input-bordered w-full"
              />
            </div>

            {/* Product Brand */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Brand</span>
              </label>
              <input
                {...register("brand")}
                type="text"
                placeholder="e.g., Sony"
                className="input input-bordered w-full"
              />
            </div>

            {/* Product Status */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Status</span>
              </label>
              <select
                {...register("status")}
                className="select select-bordered w-full"
              >
                <option disabled selected>
                  Select Status
                </option>
                <option>Active</option>
                <option>Draft</option>
                <option>Pending Approval</option>
                <option>Archived</option>
              </select>
            </div>

            {/* Product tags */}
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text">Product tags</span>
              </label>
              <textarea
                {...register("tags")}
                className="textarea textarea-bordered h-24 w-full"
                placeholder="Add tag using comma separate e.g., mobile,xiaomi,touch, etc..."
              ></textarea>

              {/* Tag Preview */}
              <div className="mt-2 flex flex-wrap gap-2">
                {tagsArray?.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-black font-bold px-3 py-1 rounded-md border text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Product Weight */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Weight</span>
              </label>
              <input
                {...register("weight")}
                type="text"
                placeholder="e.g., 180gm"
                className="input input-bordered w-full"
              />
            </div>

            {/* Discount Percentage */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Discount Percentage</span>
              </label>
              <input
                {...register("discountPercentage")}
                type="text"
                placeholder="e.g., 5%"
                className="input input-bordered w-full"
              />
            </div>

            {/* Product Specifications */}
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text">Specifications</span>
              </label>
              <textarea
                {...register("specifications")}
                className="textarea textarea-bordered h-24 w-full"
                placeholder="Specifications of the product..."
              ></textarea>
            </div>

            {/* Product Dimensions */}
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text">Dimensions</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                <input
                  {...register("length")}
                  type="text"
                  placeholder="Length (e.g., 10)"
                  className="input input-bordered w-full"
                />
                <input
                  {...register("width")}
                  type="text"
                  placeholder="Width (e.g., 5)"
                  className="input input-bordered w-full"
                />
                <input
                  {...register("height")}
                  type="text"
                  placeholder="Height (e.g., 3)"
                  className="input input-bordered w-full"
                />
                <input
                  {...register("unit")}
                  type="text"
                  placeholder="Unit (e.g., cm, in)"
                  className="input input-bordered w-full"
                />
              </div>
            </div>

            {/* Product Description */}
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                {...register("description")}
                className="textarea textarea-bordered h-24 w-full"
                placeholder="Brief description of the product..."
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="card-actions justify-end md:col-span-2 mt-4">
              <button type="submit" className="btn btn-primary">
                Add Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;