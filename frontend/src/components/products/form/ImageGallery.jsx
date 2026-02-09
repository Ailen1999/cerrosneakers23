import { useState } from 'react';

function ImageGallery({ images = [], onChange }) {
  const [mainImage, setMainImage] = useState(0);
  const maxImages = 4; // 1 main + 3 thumbnails

  const handleImageUpload = (index) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newImages = [...images];
          if (index < newImages.length) {
            newImages[index] = event.target.result;
          } else {
            newImages.push(event.target.result);
          }
          onChange?.(newImages);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange?.(newImages);
    if (mainImage >= newImages.length) {
      setMainImage(Math.max(0, newImages.length - 1));
    }
  };

  return (
    <div className="sticky top-8">
      {/* Main Image */}
      <div className="bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-800 aspect-square flex items-center justify-center mb-4 relative group overflow-hidden">
        {images.length > 0 ? (
          <>
            <img
              src={images[mainImage]}
              alt="Producto principal"
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => handleRemoveImage(mainImage)}
              className="absolute top-2 right-2 bg-black/70 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
              type="button"
            >
              <span className="material-symbols-outlined notranslate text-[18px]">delete</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => handleImageUpload(0)}
            className="flex flex-col items-center gap-3 text-gray-400 dark:text-gray-600 hover:text-black dark:hover:text-white transition-colors py-16"
            type="button"
          >
            <span className="material-symbols-outlined notranslate text-5xl">add_photo_alternate</span>
            <span className="text-sm font-medium">Subir imagen principal</span>
          </button>
        )}
      </div>

      {/* Thumbnail Gallery */}
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, index) => {
          const imageIndex = index + 1;
          const hasImage = images[imageIndex];

          return (
            <div
              key={index}
              className={`bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-800 aspect-square flex items-center justify-center relative group overflow-hidden cursor-pointer ${
                mainImage === imageIndex ? 'ring-2 ring-black dark:ring-white' : ''
              }`}
              onClick={() => hasImage && setMainImage(imageIndex)}
            >
              {hasImage ? (
                <>
                  <img
                    src={images[imageIndex]}
                    alt={`Producto ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(imageIndex);
                    }}
                    className="absolute top-1 right-1 bg-black/70 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
                    type="button"
                  >
                    <span className="material-symbols-outlined notranslate text-[14px]">delete</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageUpload(imageIndex);
                  }}
                  className="flex flex-col items-center gap-1 text-gray-300 dark:text-gray-700 hover:text-black dark:hover:text-white transition-colors p-4"
                  type="button"
                  disabled={images.length < imageIndex}
                >
                  <span className="material-symbols-outlined notranslate text-2xl">add</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
        Máximo 4 imágenes. Haz clic en las miniaturas para ver.
      </p>
    </div>
  );
}

export default ImageGallery;
