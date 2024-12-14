import {useEffect} from 'react';
import axios from 'axios';
import {useNavigate, useParams } from 'react-router-dom';

const HomeEdit = () => {

  const { del } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDel = async () => {
      try {
        await axios.put(`/api/${del}`);
        navigate('/api');
      } catch (error) {
        console.log("Error fetching Resting Time:", error);
      }
    }
    fetchDel();
  }, [])
}

export default HomeEdit;