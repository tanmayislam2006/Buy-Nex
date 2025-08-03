import React from 'react';
import { MdOutlineFileUpload } from "react-icons/md";

const ImageUpload = () => {
  return (
    <div type='button' onClick={()=>document.getElementById('upload-image').click()} className="relative group">
      <div className="relative z-40 cursor-pointer group-hover:translate-x-8 group-hover:shadow-2xl group-hover:-translate-y-8 transition-all duration-500 bg-neutral-700 flex items-center justify-center h-32 w-32 mx-auto rounded-xl">
        <MdOutlineFileUpload size={30} color='fff'/>
      </div>
      <div className="absolute border opacity-0 group-hover:opacity-80 transition-all duration-300 border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 w-32 mx-auto rounded-xl" />
    </div>
  );
}

export default ImageUpload;
