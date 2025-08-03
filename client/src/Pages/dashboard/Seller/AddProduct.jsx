import React from "react";
import ImageUpload from "../../../shared/ImageUpload";
import { useForm } from "react-hook-form";
// import useAuth from "../../../Hooks/useAuth";

const AddProduct = () => {
  // const {user}=useAuth()
  const { handleSubmit, register, watch } = useForm();

  const onSubmit = (data) => {
    const { length, width, height, unit, tags, ...product } = data;
    product.dimensions = {
      length,
      width,
      height,
      unit,
    };
    product.tags = tags.split(",").map((e) => e.trim());
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
              <div className="p-4 border-4">
                <ImageUpload />
                {/* <img className='h-32 w-32 rounded-xl object-cover' src="https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg" alt="" /> */}
              </div>
              <div>
                <input
                  id="upload-image"
                  type="file"
                  className="hidden"
                  accept="image/*"
                />
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

// export const ProductModel = {
//   id: "string/UUID", =>sever
//   sellerId: "string/UUID",=>waiting
//   name: "string",  (done)
//   description: "string",(done)
//   price: "decimal/float",(done)
//   currency: "string",(done)
//   sku: "string",(done)
//   inventory: "integer",(done)
//   images: ["string (URL)"],(done)
//   categoryId: "string/UUID",(done)
//   brandId: "string/UUID",
//   specifications: "object/JSONB", // Flexible schema for varying product attributes
//   status: "enum/string", // 'Active', 'Draft', 'Pending Approval', 'Archived'
//   createdAt: "timestamp", =>server time
//   updatedAt: "timestamp", =>server time
//   averageRating: "float", =>0
//   totalReviews: "integer", =>0
//   tags: ["string"], (done)
//   weight: "float", =>string
//   dimensions: {
//     length: "float",
//     width: "float",
//     height: "float",
//     unit: "string",
//   },
//   isFeatured: "boolean", =>false
//   discountPercentage: "float", =>0
// };
