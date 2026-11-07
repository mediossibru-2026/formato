const DocsManager = {
  documentosSeleccionados: {},
  
  iniciarModal(rfc, nombre, tipo) {
    this.rfc = rfc;
    this.nombre = nombre;
    this.tipo = tipo;
    this.documentosSeleccionados = {};
    
    document.getElementById('docModalRfc').textContent = rfc;
    document.getElementById('docModalNombre').textContent = nombre;
    
    this.renderizarListaDocumentos();
    this.actualizarBotonGuardar();
    
    document.getElementById('modalDocumentos').classList.add('activo');
  },
  
  renderizarListaDocumentos() {
    const contenedor = document.getElementById('listaDocumentosRequeridos');
    contenedor.innerHTML = '';
    
    const documentos = [...CONFIG.DOCUMENTOS_REQUERIDOS.todos];
    if (this.tipo === 'Persona Moral') {
      documentos.push(...CONFIG.DOCUMENTOS_REQUERIDOS.moral);
    }
    
    documentos.forEach(doc => {
      const div = document.createElement('div');
      div.className = 'doc-item';
      div.innerHTML = `
        <label class="doc-checkbox">
          <input type="checkbox" id="doc_${doc.id}" onchange="DocsManager.toggleDocumento('${doc.id}')">
          <span>${doc.label}</span>
        </label>
        <input type="file" id="file_${doc.id}" accept=".pdf" onchange="DocsManager.seleccionarArchivo('${doc.id}', '${doc.label}')" style="display:none;">
        <button type="button" class="btn-subir-archivo" onclick="document.getElementById('file_${doc.id}').click()" disabled>
          📎 Subir PDF
        </button>
        <span class="doc-status" id="status_${doc.id}">Pendiente</span>
      `;
      contenedor.appendChild(div);
    });
  },
  
  toggleDocumento(id) {
    const checkbox = document.getElementById(`doc_${id}`);
    const btnSubir = document.getElementById(`file_${id}`).nextElementSibling;
    
    if (checkbox.checked) {
      btnSubir.disabled = false;
    } else {
      btnSubir.disabled = true;
      delete this.documentosSeleccionados[id];
      document.getElementById(`status_${id}`).textContent = 'Pendiente';
      document.getElementById(`status_${id}`).className = 'doc-status pendiente';
    }
    
    this.actualizarBotonGuardar();
  },
  
  async seleccionarArchivo(id, label) {
    const fileInput = document.getElementById(`file_${id}`);
    const file = fileInput.files[0];
    
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Solo se aceptan archivos PDF');
      fileInput.value = '';
      return;
    }
    
    const statusEl = document.getElementById(`status_${id}`);
    statusEl.textContent = 'Subiendo...';
    statusEl.className = 'doc-status subiendo';
    
    try {
      const base64 = await Utils.archivoABase64(file);
      
      const result = await Utils.fetchAPI({
        action: 'subirDocumento',
        rfc: this.rfc,
        nombreArchivo: `${id}_${label.replace(/\s+/g, '_')}.pdf`,
        base64Data: base64,
        mimeType: 'application/pdf'
      });
      
      if (result.result === 'success') {
        this.documentosSeleccionados[id] = {
          nombre: label,
          archivoId: result.archivoId,
          url: result.archivoUrl
        };
        statusEl.textContent = '✓ Subido';
        statusEl.className = 'doc-status subido';
      } else {
        throw new Error(result.message);
      }
    } catch (e) {
      statusEl.textContent = '✗ Error';
      statusEl.className = 'doc-status error';
      alert('Error al subir: ' + e.message);
    }
    
    this.actualizarBotonGuardar();
  },
  
  actualizarBotonGuardar() {
    const documentos = [...CONFIG.DOCUMENTOS_REQUERIDOS.todos];
    if (this.tipo === 'Persona Moral') {
      documentos.push(...CONFIG.DOCUMENTOS_REQUERIDOS.moral);
    }
    
    const todosMarcados = documentos.every(doc => this.documentosSeleccionados[doc.id]);
    const btnGuardar = document.getElementById('btnGuardarDocs');
    
    if (btnGuardar) {
      btnGuardar.disabled = !todosMarcados;
    }
  },
  
  async guardarDocumentos() {
    const documentos = [...CONFIG.DOCUMENTOS_REQUERIDOS.todos];
    if (this.tipo === 'Persona Moral') {
      documentos.push(...CONFIG.DOCUMENTOS_REQUERIDOS.moral);
    }
    
    const faltantes = documentos.filter(doc => !this.documentosSeleccionados[doc.id]);
    
    if (faltantes.length > 0) {
      alert('Debes completar la documentación para poder enviar.\n\nFaltan:\n• ' + faltantes.map(d => d.label).join('\n• '));
      return;
    }
    
    const btnGuardar = document.getElementById('btnGuardarDocs');
    btnGuardar.disabled = true;
    btnGuardar.textContent = 'Guardando...';
    
    try {
      await Utils.fetchAPI({
        action: 'crearCarpetaCliente',
        rfc: this.rfc,
        nombre: this.nombre
      });
      
      alert('✅ Documentación guardada exitosamente.\n\nTodos los archivos están disponibles en la carpeta del cliente en Google Drive.');
      this.cerrarModal();
    } catch (e) {
      alert('Error: ' + e.message);
    } finally {
      btnGuardar.disabled = false;
      btnGuardar.textContent = 'Guardar Documentación';
    }
  },
  
  cerrarModal() {
    document.getElementById('modalDocumentos').classList.remove('activo');
  }
};
