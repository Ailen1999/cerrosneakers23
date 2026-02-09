import axios from '../utils/axiosConfig';

const uploadService = {
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // axiosInstance already has baseURL, interceptors for token, and default headers
    const response = await axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data; // { url: '...' }
  }
};

export default uploadService;
