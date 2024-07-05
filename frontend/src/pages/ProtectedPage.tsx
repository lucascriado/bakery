import React, { useEffect, useState } from 'react';
import { getProtectedData } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const ProtectedPage: React.FC = () => {
  const [data, setData] = useState<string>('');
  const token = localStorage.getItem('token'); // Supondo que você armazene o token no localStorage
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const response = await getProtectedData(token);
          setData(response);
        } catch (error) {
          console.error('Erro ao acessar a rota protegida', error);
          setData('Acesso negado');
          navigate('/login'); // Redireciona para a tela de login se o acesso for negado
        }
      } else {
        navigate('/login'); // Redireciona para a tela de login se não houver token
      }
    };

    fetchData();
  }, [token, navigate]);

  return (
    <div>
      <h1>Rota Protegida</h1>
      <p>{data}</p>
    </div>
  );
};

export default ProtectedPage;
