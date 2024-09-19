import React from "react";

interface ImageModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  imageSrc,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleBackgroundClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      // Close modal if background is clicked
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={handleBackgroundClick} // Add click handler to the modal background
    >
      <div className="relative">
        <img
          src={imageSrc}
          alt="Full-size view"
          className="max-h-screen max-w-screen"
        />
        <button
          className="absolute top-0 right-0 mt-2 mr-2 p-2 bg-white rounded-full shadow-lg"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
