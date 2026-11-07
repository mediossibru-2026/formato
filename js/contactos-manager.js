const ContactosManager = {
  mostrarModal(cliente) {
    this.cliente = cliente;
    
    document.getElementById('contModalNombre').textContent = cliente['Nombre/Razón Social'] || cliente['Nombre'] || '';
    document.getElementById('contModalRfc').textContent = cliente['RFC'] || '';
    
    // Facturación
    document.getElementById('contFactNumero').textContent = cliente['Facturacion Numero'] || 'No registrado';
    const factCorreo = cliente['Facturacion Correo'] || '';
    const factWhatsApp = cliente['Facturacion WhatsApp'] || '';
    
    document.getElementById('contFactCorreo').innerHTML = factCorreo 
      ? `<a href="${Utils.generarLinkMail(factCorreo, 'Facturación - Grupo SIBRÜ')}" target="_blank">${factCorreo}</a>`
      : 'No registrado';
    
    document.getElementById('contFactWhatsApp').innerHTML = factWhatsApp
      ? `<a href="${Utils.generarLinkWhatsApp(factWhatsApp, 'Hola, soy de Grupo SIBRÜ')}" target="_blank">${factWhatsApp}</a>`
      : 'No registrado';
    
    // Cuentas por pagar
    document.getElementById('contCppNumero').textContent = cliente['CuentasPorPagar Numero'] || 'No registrado';
    const cppCorreo = cliente['CuentasPorPagar Correo'] || '';
    const cppWhatsApp = cliente['CuentasPorPagar WhatsApp'] || '';
    
    document.getElementById('contCppCorreo').innerHTML = cppCorreo
      ? `<a href="${Utils.generarLinkMail(cppCorreo, 'Cuentas por Pagar - Grupo SIBRÜ')}" target="_blank">${cppCorreo}</a>`
      : 'No registrado';
    
    document.getElementById('contCppWhatsApp').innerHTML = cppWhatsApp
      ? `<a href="${Utils.generarLinkWhatsApp(cppWhatsApp, 'Hola, soy de Grupo SIBRÜ')}" target="_blank">${cppWhatsApp}</a>`
      : 'No registrado';
    
    document.getElementById('modalContactos').classList.add('activo');
  },
  
  cerrarModal() {
    document.getElementById('modalContactos').classList.remove('activo');
  }
};
