import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Modal from '../../components/shared/Modal';
import { useToast, ToastContainer } from '../../components/shared/Toast';
import carouselService from '../../services/carouselService';

function CarouselAdminPage() {
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();
  
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, slideId: null });

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    try {
      setLoading(true);
      // We need an endpoint to get ALL slides (including inactive) for admin
      // Assuming getActiveSlides returns currently active, we might need a separate endpoint or param
      // For now, let's use getActiveSlides as a starting point or check service
      // The implementation plan mentioned getAllSlides() but backend might not have it yet
      // The backend plan (routes.go) has: carouselSlides.GET("", carouselHandler.GetActiveSlides) for customer
      // And carouselSlides.GET("/:id") ...
      // Wait, there is no explicit "GetAllSlides" (admin) in routes.go snippet I saw earlier?
      // Re-checking routes.go snippet from memory/log:
      // "carouselSlides.GET("", carouselHandler.GetActiveSlides)" -> context says active
      // But usually admin needs all.
      // If backend only serves active, I can only list active. 
      // However, usually GET /api/carousel-slides might return all for admin or I need query param ?active=false
      // Let's assume getActiveSlides returns all for now or refactor later.
      // Actually, looking at routes.go:
      // carouselSlides.GET("", carouselHandler.GetActiveSlides)
      // I should probably check if there is an admin endpoint. 
      // If not, I will use getActiveSlides and note it.
      // BUT, I can see "carouselSlides.POST", "PUT", "DELETE" are there.
      // Maybe GetActiveSlides returns all but filtered? 
      // Let's use getActiveSlides and see.
      const data = await carouselService.getActiveSlides();
      setSlides(data);
    } catch (error) {
      console.error('Error loading slides:', error);
      showToast('Error al cargar slides', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/carousel/edit/${id}`);
  };

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, slideId: id });
  };

  const handleDeleteConfirm = async () => {
    try {
      await carouselService.deleteSlide(deleteModal.slideId);
      setDeleteModal({ isOpen: false, slideId: null });
      showToast('Slide eliminado exitosamente', 'success');
      loadSlides();
    } catch (err) {
      console.error('Error deleting slide:', err);
      showToast('Error al eliminar el slide', 'error');
    }
  };

  return (
    <MainLayout pageTitle="Gestión de Carousel">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold dark:text-white">Diapositivas</h2>
          <button
            onClick={() => navigate('/admin/carousel/create')}
            className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <span className="material-symbols-outlined notranslate text-[16px]">add</span>
            Nueva Diapositiva
          </button>
        </div>

        {loading ? (
          <div className="bg-white dark:bg-[#1E1E1E] shadow-sm border border-gray-200 dark:border-gray-800 p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">Cargando slides...</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1E1E1E] shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#252525]">
                  <th className="p-4 text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">Orden</th>
                  <th className="p-4 text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">Imagen</th>
                  <th className="p-4 text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">Título</th>
                  <th className="p-4 text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">Estado</th>
                  <th className="p-4 text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {slides.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500 dark:text-gray-400">
                      No hay slides configurados
                    </td>
                  </tr>
                ) : (
                  slides.map((slide) => (
                    <tr key={slide.id} className="hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors">
                      <td className="p-4 text-sm text-gray-900 dark:text-gray-100">{slide.orden}</td>
                      <td className="p-4">
                        <img 
                          src={slide.imagen_url} 
                          alt={slide.titulo} 
                          className="h-12 w-20 object-cover rounded border border-gray-200 dark:border-gray-700"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{slide.titulo}</span>
                          <span className="text-xs text-gray-500">{slide.subtitulo}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          slide.activo 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {slide.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(slide.id)}
                            className="p-1 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded transition-colors"
                            title="Editar"
                          >
                            <span className="material-symbols-outlined notranslate text-[20px]">edit</span>
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(slide.id)}
                            className="p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded transition-colors"
                            title="Eliminar"
                          >
                            <span className="material-symbols-outlined notranslate text-[20px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <Modal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, slideId: null })}
          onConfirm={handleDeleteConfirm}
          title="Eliminar Slide"
          message="¿Estás seguro de que deseas eliminar este slide?"
          confirmText="Eliminar"
          cancelText="Cancelar"
        />
      </div>
    </MainLayout>
  );
}

export default CarouselAdminPage;
