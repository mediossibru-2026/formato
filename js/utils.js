const Utils = {
  validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },
  
  validarRFC(rfc, tipo) {
    const longitud = tipo === 'fisica' ? 13 : 12;
    return rfc.length === longitud;
  },
  
  async fetchAPI(data) {
    try {
      const res = await fetch(CONFIG.SHEET_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (e) {
      return { result: 'error', message: e.message };
    }
  },
  
  async verificarRFC(rfc) {
    return await this.fetchAPI({ action: 'verificarRFC', rfc: rfc });
  },
  
  async obtenerNuevoID() {
    const result = await this.fetchAPI({ action: 'obtenerSiguienteID' });
    return result.result === 'success' ? result.idCliente : null;
  },
  
  formatearWhatsApp(numero) {
    // Formato: 521 + 10 dígitos para México
    const limpio = numero.replace(/\D/g, '');
    if (limpio.length === 10) return '521' + limpio;
    if (limpio.length === 12 && limpio.startsWith('52')) return limpio;
    return limpio;
  },
  
  generarLinkWhatsApp(numero, mensaje = '') {
    const tel = this.formatearWhatsApp(numero);
    const url = `https://wa.me/${tel}`;
    return mensaje ? `${url}?text=${encodeURIComponent(mensaje)}` : url;
  },
  
  generarLinkMail(correo, asunto = '', cuerpo = '') {
    let url = `mailto:${correo}`;
    const params = [];
    if (asunto) params.push(`subject=${encodeURIComponent(asunto)}`);
    if (cuerpo) params.push(`body=${encodeURIComponent(cuerpo)}`);
    return params.length ? `${url}?${params.join('&')}` : url;
  },
  
  archivoABase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
};
