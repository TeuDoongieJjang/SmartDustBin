import {useEffect} from 'react';
import axios from 'axios';
import {useNavigate, useParams } from 'react-router-dom';

const DateEdit = () => {

  const { date, field } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDel = async () => {
      try {
        await axios.put(`/api/${field}/${date}`);
        navigate('/api');
      } catch (error) {
        console.log("Error fetching Deleting Date:", error);
      }
    }
    fetchDel();
  }, [])
}

export default DateEdit;