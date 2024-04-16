import React, { useState } from 'react';
import axios from 'axios';

function Blabla() {
  const [imagem, setImagem] = useState(null);

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('imagem', imagem);

      await axios.post('http://localhost:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Imagem enviada com sucesso.');
    } catch (error) {
      console.error('Erro ao enviar a imagem:', error);
      alert('Erro ao enviar a imagem.');
    }
  };

  return (
    <div>
      <h1>Upload de Imagem</h1>
      <input type="file" onChange={(e) => setImagem(e.target.files[0])} />
      <button onClick={handleUpload}>Enviar</button>
    </div>
  );
}

export default Blabla;