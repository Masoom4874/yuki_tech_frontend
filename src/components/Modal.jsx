import React from "react";
import CloseIcon from "./CloseIcon";
import ImageCropper from "./ImageCropper";

const Modal = ({ closeModal, updateAvatar, src }) => {
  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-all backdrop-blur-sm flex justify-center items-center"
      aria-labelledby="crop-image-dialog"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-screen-sm bg-gray-800 text-slate-100 rounded-lg shadow-xl">
        <div className="px-5 py-4">
          <button
            type="button"
            className="absolute top-2 right-2 rounded-md p-1 inline-flex items-center justify-center text-gray-400 hover:bg-gray-700 focus:outline-none"
            onClick={closeModal}
          >
            <span className="sr-only">Close menu</span>
            <CloseIcon />
          </button>
          <ImageCropper
            closeModal={closeModal}
            updateAvatar={updateAvatar}
            src={src}
          />
        </div>
      </div>
    </div>
  );
};

export default Modal;
