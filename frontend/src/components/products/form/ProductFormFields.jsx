function ProductFormFields({ formData, onChange, errors = {} }) {
  const handleChange = (field, value) => {
    onChange?.({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-8">
      {/* Nombre del Producto */}
      <div>
        <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold mb-3">
          Nombre del Producto
        </label>
        <input
          type="text"
          value={formData.nombre || ''}
          onChange={(e) => handleChange('nombre', e.target.value)}
          className="minimal-input w-full py-2 text-base text-black"
          placeholder="Ej: Camisa de Lino Premium"
          required
        />
        {errors.nombre && (
          <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Género */}
        <div>
           <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold mb-3">
             Género
           </label>
           <select
             value={formData.genero || ''}
             onChange={(e) => handleChange('genero', e.target.value)}
             className="minimal-input w-full py-2 text-base text-black"
             required
           >
             <option value="">Seleccionar</option>
             <option value="hombre">Hombre</option>
             <option value="mujer">Mujer</option>
             <option value="unisex">Unisex</option>
             <option value="nino">Niños</option>
           </select>
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold mb-3">
            Categoría
          </label>
          <select
            value={formData.categoria || ''}
            onChange={(e) => handleChange('categoria', e.target.value)}
            className="minimal-input w-full py-2 text-base text-black"
            required
          >
            <option value="">Seleccionar</option>
            <option value="indumentaria">Indumentaria</option>
            <option value="calzado">Calzado</option>
            <option value="deportes">Deportes</option>
          </select>
          {errors.categoria && (
            <p className="text-red-500 text-xs mt-1">{errors.categoria}</p>
          )}
         </div>

        {/* Temporada */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold mb-3">
            Temporada
          </label>
          <select
            value={formData.temporada || ''}
            onChange={(e) => handleChange('temporada', e.target.value)}
            className="minimal-input w-full py-2 text-base text-black"
          >
            <option value="">Seleccionar</option>
            <option value="invierno">Invierno</option>
            <option value="verano">Verano</option>
          </select>
        </div>

      </div>

      {/* Descripción */}
      <div>
        <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold mb-3">
          Descripción
        </label>
        <textarea
          value={formData.descripcion || ''}
          onChange={(e) => handleChange('descripcion', e.target.value)}
          className="minimal-input w-full py-2 resize-none text-base text-black"
          rows={4}
          placeholder="Detalles sobre materiales, corte y diseño..."
        />
        {errors.descripcion && (
          <p className="text-red-500 text-xs mt-1">{errors.descripcion}</p>
        )}
      </div>
    </div>
  );
}

export default ProductFormFields;
