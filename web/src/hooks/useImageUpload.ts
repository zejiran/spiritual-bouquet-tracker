import axios from 'axios';

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

export const useImageUpload = () => {
  const uploadImage = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        formData
      );

      return response.data.data.url;
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error('Failed to upload image');
    }
  };

  return { uploadImage };
};
