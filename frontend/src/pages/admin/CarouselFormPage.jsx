import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Breadcrumb from '../../components/shared/Breadcrumb';
import { useToast, ToastContainer } from '../../components/shared/Toast';
import carouselService from '../../services/carouselService';
import uploadService from '../../services/uploadService';

function CarouselFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { toasts, showToast, removeToast } = useToast();

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    titulo: '',
    subtitulo: '',
    imagen_url: '',
    orden: 0,
    activo: true,
    position_y: 50
  });

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Carousel', path: '/admin/carousel' },
    { label: isEditing ? 'Editar Slide' : 'Nuevo Slide' },
  ];

  useEffect(() => {
    if (isEditing) {
      loadSlide();
    }
  }, [id]);

  const loadSlide = async () => {
    try {
      setLoading(true);
      const data = await carouselService.getSlideById(id);
      setFormData({
        titulo: data.titulo || '',
        subtitulo: data.subtitulo || '',
        imagen_url: data.imagen_url || '',
        link_cta: data.link_cta || '',
        producto_id: data.producto_id || '',
        orden: data.orden || 0,
        activo: data.activo !== undefined ? data.activo : true,
        position_y: data.position_y !== undefined ? data.position_y : 50
      });
    } catch (error) {
      console.error('Error loading slide:', error);
      showToast('Error al cargar el slide', 'error');
      navigate('/admin/carousel');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const response = await uploadService.uploadFile(file);
      setFormData(prev => ({
        ...prev,
        imagen_url: response.url
      }));
      showToast('Imagen subida correctamente', 'success');
    } catch (error) {
      console.error('Error uploading file:', error);
      showToast('Error al subir la imagen', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      // Prepare data (convert types and clean up)
      const dataToSend = {
        ...formData,
        orden: parseInt(formData.orden) || 0,
        position_y: !isNaN(parseInt(formData.position_y)) ? parseInt(formData.position_y) : 50,
        producto_id: formData.producto_id && formData.producto_id !== 'null' ? parseInt(formData.producto_id) : null,
        subtitulo: formData.subtitulo || null,
        link_cta: formData.link_cta || ''
      };

      if (isEditing) {
        await carouselService.updateSlide(id, dataToSend);
        showToast('Slide actualizado correctamente', 'success');
      } else {
        await carouselService.createSlide(dataToSend);
        showToast('Slide creado correctamente', 'success');
      }
      
      // Navigate back after short delay
      setTimeout(() => {
        navigate('/admin/carousel');
      }, 1000);
      
    } catch (error) {
      console.error('Error saving slide:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Error al guardar el slide';
      showToast(errorMessage, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout pageTitle={isEditing ? "Editar Slide" : "Nuevo Slide"}>
        <div className="flex justify-center p-12">Cargando...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout pageTitle={isEditing ? "Editar Slide" : "Nuevo Slide"}>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      <div className="max-w-4xl mx-auto">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="bg-white dark:bg-[#1E1E1E] shadow-sm border border-gray-200 dark:border-gray-800 p-6 sm:p-8 mt-6">
          <h2 className="text-2xl font-display font-bold mb-6 dark:text-white">
            {isEditing ? 'Editar Diapositiva' : 'Nueva Diapositiva'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Título */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Título Principal
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-[#252525] dark:text-white focus:ring-1 focus:ring-black dark:focus:ring-white outline-none transition-all"
                  placeholder="Ej: NUEVA COLECCIÓN"
                />
              </div>

              {/* Subtítulo */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Subtítulo
                </label>
                <input
                  type="text"
                  name="subtitulo"
                  value={formData.subtitulo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-[#252525] dark:text-white focus:ring-1 focus:ring-black dark:focus:ring-white outline-none transition-all"
                  placeholder="Ej: VERANO 2026"
                />
              </div>

              {/* Imagen Upload */}
              <div className="space-y-2 col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Imagen de la Diapositiva *
                </label>
                
                <div className="flex flex-col gap-4">
                  <div className="relative group">
                    <input
                      type="file"
                      id="image-upload"
                      className="hidden"
                      onChange={handleFileUpload}
                      accept="image/*"
                    />
                    <label 
                      htmlFor="image-upload"
                      className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-black dark:hover:border-white transition-colors bg-gray-50 dark:bg-[#252525] ${uploading ? 'opacity-50 cursor-wait' : ''}`}
                    >
                      {formData.imagen_url ? (
                        <div className="relative w-full h-full p-2">
                          <img
                            src={formData.imagen_url}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-md"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-md">
                            <span className="text-white font-medium">Cambiar imagen</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                          </svg>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Click para subir</span> o arrastrar y soltar
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG o WEBP (Sugerido: 1920x1080px)</p>
                        </div>
                      )}
                      {uploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-black/60 rounded-lg">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
                        </div>
                      )}
                    </label>
                  </div>

                  {/* Input oculto para que el form siga validando imagen_url si es necesario, o para edición manual avanzada */}
                  <input
                    type="hidden"
                    name="imagen_url"
                    value={formData.imagen_url}
                    required
                  />
                </div>
              </div>


              {/* Alineación Vertical (Slider) */}
              {formData.imagen_url && (
                <div className="space-y-4 col-span-1 md:col-span-2 bg-gray-50 dark:bg-[#252525] p-6 border border-gray-200 dark:border-gray-800">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                      Alineación Vertical: {formData.position_y}%
                    </label>
                    <span className="text-xs text-gray-500 uppercase tracking-tighter">Mueve la imagen arriba/abajo</span>
                  </div>
                  
                  <input
                    type="range"
                    name="position_y"
                    min="0"
                    max="100"
                    value={formData.position_y}
                    onChange={handleChange}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
                  />
                  
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">Vista Previa (Formato Carrusel)</p>
                    <div className="w-full h-[300px] relative overflow-hidden border border-gray-300 dark:border-gray-700 bg-black">
                      <img
                        src={formData.imagen_url}
                        alt="Preview"
                        className="w-full h-full object-cover transition-all duration-300"
                        style={{ objectPosition: `center ${formData.position_y}%` }}
                      />
                      {/* Overlay indicator */}
                      <div className="absolute inset-0 border-2 border-black/10 pointer-events-none"></div>
                    </div>
                    <p className="text-center text-[10px] text-gray-400 italic">Así se verá el slide en la home page</p>
                  </div>
                </div>
              )}

              {/* Orden */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Orden de aparición
                </label>
                <input
                  type="number"
                  name="orden"
                  value={formData.orden}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-[#252525] dark:text-white focus:ring-1 focus:ring-black dark:focus:ring-white outline-none transition-all"
                />
              </div>

              {/* Activo Checkbox */}
              <div className="space-y-2 flex items-center pt-8">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleChange}
                    className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black dark:bg-[#252525] dark:border-gray-600"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Visible en el sitio
                  </span>
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => navigate('/admin/carousel')}
                className="px-6 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className={`px-6 py-2 bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-wider hover:opacity-90 transition-opacity ${
                  saving ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {saving ? 'Guardando...' : 'Guardar Slide'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}

export default CarouselFormPage;
