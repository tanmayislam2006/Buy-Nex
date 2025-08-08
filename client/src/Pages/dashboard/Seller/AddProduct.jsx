import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import ImageUpload from "../../../shared/ImageUpload";
import useAuth from "../../../Hooks/useAuth";

const AddProduct = ({ product: initialProduct }) => {
  const { user } = useAuth();
  const sellerEmail = user.email;
  const { handleSubmit, register, watch, formState: { errors }, reset, setValue } = useForm();
  const [imageLinks, setImageLinks] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialProduct) {
      Object.keys(initialProduct).forEach((key) => {
        if (key === "dimensions") {
          setValue("length", initialProduct.dimensions.length);
          setValue("width", initialProduct.dimensions.width);
          setValue("height", initialProduct.dimensions.height);
          setValue("unit", initialProduct.dimensions.unit);
        } else if (key === "tags") {
          setValue(key, initialProduct[key].join(", "));
        } else if (key === "specifications") {
          setValue(key, Object.entries(initialProduct[key]).map(([specKey, specValue]) => `${specKey}: ${specValue}`).join("\n"));
        }else if(key === "seoKeywords"){
          setValue(key, initialProduct.seoKeywords.join(", "));
        } else {
          setValue(key, initialProduct[key]);
        }
      });
      setImageLinks(initialProduct.images || []);
    }
  }, [initialProduct, setValue]);

  const handleImageUpload = (files) => {
    const apiKey = import.meta.env.VITE_IMMGBB_API_KEY;
    const uploadPromises = files.map((file) => {
      const formData = new FormData();
      formData.append("image", file);
      return axios.post(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        formData
      );
    });

    toast.promise(Promise.all(uploadPromises), {
      loading: "Uploading images...",
      success: (responses) => {
        const newImageLinks = responses.map((res) => res.data.data.url);
        setImageLinks((prevLinks) => [...prevLinks, ...newImageLinks]);
        return "Images uploaded successfully";
      },
      error: "Error uploading images",
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
    if (files.length > 0) {
      handleImageUpload(files);
    }
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
    if (files.length > 0) {
      handleImageUpload(files);
    }
  };

  const onSubmit = async (data) => {
    if (imageLinks.length === 0) {
      toast.error("Please upload at least one product image.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const { length, width,seoKeywords, height, unit, tags, ...product } = data;
    product.dimensions = {
      length,
      width,
      height,
      unit,
    };
    product.tags = tags.split(",").map((e) => e.trim());
    product.sellerEmail = sellerEmail;
    product.images = imageLinks;
    product.seoKeywords = seoKeywords.split(",").map((e) => e.trim());
    const specLines = product.specifications.split("\n");
    const specObj = {};
    for (const line of specLines) {
      const [key, ...rest] = line.split(":");
      if (key && rest.length > 0) {
        specObj[key.trim()] = rest.join(":").trim();
      }
    }
    product.specifications = specObj;

    try {
      let res;
      if (initialProduct) {
        res = await axios.put(`http://localhost:5000/products/${initialProduct._id}`, product);
      } else {
        product.rating = 0;
        product.review = 0;
        res = await axios.post("http://localhost:5000/products", product);
      }

      if (res.status === 200 || res.status === 201) {
        toast.success(`Product ${initialProduct ? 'updated' : 'added'} successfully!`);
        if (!initialProduct) {
          reset();
          setImageLinks([]);
        }
      } else {
        throw new Error(`Failed to ${initialProduct ? 'update' : 'add'} product`);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "An unexpected error occurred."
      );
      toast.error(err.response?.data?.message || `Failed to ${initialProduct ? 'update' : 'add'} product.`);
    } finally {
      setIsLoading(false);
    }
  };

  const seoKeywordsValue = watch("seoKeywords");
  const seoKeywordsArray = seoKeywordsValue
    ?.split(",")
    .map((keyword) => keyword.trim())

    .filter((tag) => tag.length > 0);
  const tagsValue = watch("tags");
  const tagsArray = tagsValue
    ?.split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  const specificationsValue = watch("specifications");
  const specificationsArray = specificationsValue
    ?.split("\n")
    .map((spec) => spec.split(":"))
    .filter((spec) => spec.length === 2 && spec[0].trim() && spec[1].trim());
  return (
    <div className="px-4 py-16 md:py-0 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-3xl font-bold mb-4 md:mb-6 text-orange-600">
          {initialProduct ? "Update Product" : "Add New Product"}
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
                  accept="image/*"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex justify-center">
                    <ImageUpload isDragActive={isDragActive} />
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

            <div className="form-control">
              <label className="label">
                <span className="label-text">Product Name</span>
              </label>
              <input
                type="text"
                {...register("name", { required: "Product name is required" })}
                placeholder="e.g., Wireless Headphones"
                className={`input input-bordered w-full ${
                  errors.name ? "input-error" : ""
                }`}
              />
              {errors.name && (
                <span className="text-red-500 text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* Product oldPrice */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Old Price</span>
              </label>
              <input
                type="number"
                placeholder="e.g., 99.99"
                {...register("oldPrice", {
                  required: "oldPrice is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "oldPrice must be positive" },
                })}
                className={`input input-bordered w-full ${
                  errors.oldPrice ? "input-error" : ""
                }`}
              />
              {errors.oldPrice && (
                <span className="text-red-500 text-sm">
                  {errors.oldPrice.message}
                </span>
              )}
            </div>

            {/* Product Price */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Price</span>
              </label>
              <input
                type="number"
                placeholder="e.g., 99.99"
                {...register("price", {
                  required: "Price is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Price must be positive" },
                })}
                className={`input input-bordered w-full ${
                  errors.price ? "input-error" : ""
                }`}
              />
              {errors.price && (
                <span className="text-red-500 text-sm">
                  {errors.price.message}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Currency</span>
              </label>
              <input
                type="text"
                placeholder="e.g., BDT"
                {...register("currency", { required: "Currency is required" })}
                className={`input input-bordered w-full ${
                  errors.currency ? "input-error" : ""
                }`}
              />
              {errors.currency && (
                <span className="text-red-500 text-sm">
                  {errors.currency.message}
                </span>
              )}
            </div>

            {/* Product Category */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className={`select select-bordered w-full ${
                  errors.category ? "select-error" : ""
                }`}
                defaultValue=""
              >
                <option value="" disabled>
                  Select Category
                </option>
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Groceries</option>
                <option>Vegetables</option>
                <option>Home & Garden</option>
                <option>Sports</option>
                <option>Beauty</option>
                <option>Automotive</option>
                <option>Books</option>
                <option>Baby & Kids</option>
              </select>
              {errors.category && (
                <span className="text-red-500 text-sm">
                  {errors.category.message}
                </span>
              )}
            </div>

            {/* Inventory */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Inventory</span>
              </label>
              <input
                {...register("inventory", {
                  required: "Inventory is required",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "Inventory must be a positive number",
                  },
                })}
                type="number"
                placeholder="e.g., 150"
                className={`input input-bordered w-full ${
                  errors.inventory ? "input-error" : ""
                }`}
              />
              {errors.inventory && (
                <span className="text-red-500 text-sm">
                  {errors.inventory.message}
                </span>
              )}
            </div>

            {/* Product Brand */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Brand</span>
              </label>
              <input
                {...register("brand", { required: "Brand is required" })}
                type="text"
                placeholder="e.g., Sony"
                className={`input input-bordered w-full ${
                  errors.brand ? "input-error" : ""
                }`}
              />
              {errors.brand && (
                <span className="text-red-500 text-sm">
                  {errors.brand.message}
                </span>
              )}
            </div>

            {/* Product tags */}
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text">Product tags</span>
              </label>
              <textarea
                {...register("tags", { required: "Tags are required" })}
                className={`textarea textarea-bordered h-24 w-full ${
                  errors.tags ? "textarea-error" : ""
                }`}
                placeholder="Add tag using comma separate e.g., mobile,xiaomi,touch, etc..."
              ></textarea>
              {errors.tags && (
                <span className="text-red-500 text-sm">
                  {errors.tags.message}
                </span>
              )}

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

            {/* Product Specifications */}
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text">Specifications</span>
              </label>
              <textarea
                {...register("specifications")}
                className="textarea textarea-bordered h-24 w-full"
                placeholder="Enter specifications, one per line, in key: value format (e.g., Processor: Core i5)"
              ></textarea>
              {/* Specifications Preview */}
              <div className="mt-2 flex flex-wrap gap-2">
                {specificationsArray?.map(([key, value], idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-black font-bold px-3 py-1 rounded-md border text-sm"
                  >
                    {key}: {value}
                  </span>
                ))}
              </div>
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
                {...register("description", {
                  required: "Description is required",
                })}
                className={`textarea textarea-bordered h-24 w-full ${
                  errors.description ? "textarea-error" : ""
                }`}
                placeholder="Brief description of the product..."
              ></textarea>
              {errors.description && (
                <span className="text-red-500 text-sm">
                  {errors.description.message}
                </span>
              )}
            </div>

            {/* SEO Keywords */}
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text">SEO Keywords</span>
              </label>
              <textarea
                {...register("seoKeywords", {
                  required: "SEO keywords are required",
                })}
                className={`textarea textarea-bordered h-24 w-full ${
                  errors.seoKeywords ? "textarea-error" : ""
                }`}
                placeholder="Add SEO keywords, separated by commas e.g., wireless headphones, bluetooth headset, noise cancelling"
              ></textarea>
              {errors.seoKeywords && (
                <span className="text-red-500 text-sm">
                  {errors.seoKeywords.message}
                </span>
              )}

              {/* SEO Keywords Preview */}
              <div className="mt-2 flex flex-wrap gap-2">
                {seoKeywordsArray?.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-black font-bold px-3 py-1 rounded-md border text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="card-actions justify-end md:col-span-2 mt-4">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : initialProduct ? (
                  "Update Product"
                ) : (
                  "Add Product"
                )}
              </button>
            </div>
          </form>
          {error && <div className="text-red-500 mt-4">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
