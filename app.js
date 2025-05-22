document.getElementById('procedure-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const serviceRequestId = document.getElementById('service-request-id').value;

  // Validación inicial en frontend
  if (!serviceRequestId) {
    alert("Debes ingresar un ID de ServiceRequest válido.");
    return;
  }

  const procedure = {
    resourceType: "Procedure",
    status: "completed",
    code: {
      coding: [{
        system: "http://snomed.info/sct",
        code: document.getElementById('procedure-code').value,
        display: document.getElementById('procedure-desc').value
      }],
      text: document.getElementById('procedure-desc').value
    },
    subject: {
      reference: "Patient/" + document.getElementById('patient-id').value
    },
    performedDateTime: document.getElementById('date').value,
    performer: [{
      actor: {
        reference: "Practitioner/" + document.getElementById('practitioner-id').value
      }
    }],
    basedOn: document.getElementById('service-request-id').value
      ? [{
          reference: "ServiceRequest/" + document.getElementById('service-request-id').value
        }]
      : [],
    reasonCode: document.getElementById('reason').value
      ? [{
          text: document.getElementById('reason').value
        }]
      : [],
    note: document.getElementById('notes').value
      ? [{
          text: document.getElementById('notes').value
        }]
      : []
  };
  
  console.log("FHIR Payload:", procedure);

  // Enviar la solicitud al backend (sin trailing slash)
  fetch('https://hl7-fhir-ehr-michael.onrender.com/procedures', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(procedure)
  })
  .then(async response => {
    if (!response.ok) {
      const errorText = await response.text();  // ✅ leer texto del error
      throw new Error('Error en la solicitud: ' + response.statusText + ' - ' + errorText);
    }
    return response.json();
  })
  .then(data => {
    console.log('Success:', data);
    alert('Procedimiento registrado exitosamente! ID: ' + data._id);
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Hubo un error en la solicitud: ' + error.message);
  });
});
