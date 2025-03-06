import { XMarkIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useImageUpload } from '../hooks/useImageUpload';

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUploaded,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage } = useImageUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 32 * 1024 * 1024) {
      toast.error('La imagen no debe superar los 32MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      setIsUploading(true);
      const imageUrl = await uploadImage(file);
      onImageUploaded(imageUrl);
      toast.success('Imagen subida exitosamente');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Error al subir la imagen');
      handleRemove();
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageUploaded('');
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Imagen (opcional)
        </label>
        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
          >
            <XMarkIcon className="w-4 h-4" />
            Eliminar
          </button>
        )}
      </div>

      <div className="relative">
        <AnimatePresence>
          {preview ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative aspect-video rounded-lg overflow-hidden bg-gray-100"
            >
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center w-full aspect-video rounded-lg border-2 border-dashed border-gray-300 bg-gray-50"
            >
              <button
                type="button"
                onClick={handleButtonClick}
                className="flex flex-col items-center justify-center p-6 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-8 h-8 mb-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">
                    Click para subir una imagen
                  </span>
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG o GIF (max. 32MB)
                </p>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
