import {useEffect} from 'react'
import axios from 'axios'
import {useNavigate, useParams } from 'react-router-dom'

const AddDate = () => {

  const { bin } = useParams();

  const navigate = useNavigate()

  useEffect(() => {
    const fetchAdd = async () => {
      try {
        const res = await axios.post(`/api/add/${bin}`)
        navigate('/api')
      } catch (error) {
        console.log("Error fetching add dates:", error);
      }
    }
    fetchAdd()
  }, [])
}

export default AddDate