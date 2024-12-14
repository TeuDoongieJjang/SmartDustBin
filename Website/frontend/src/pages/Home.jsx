import { React, useEffect, useState } from "react";
import { useNavigate} from 'react-router-dom'
import axios from "axios";

const Home = () => {
  const [recycleableDate, setRecycleableDate] = useState([]);
  const [nonBioDate, setNonBioDate] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api');
        setRecycleableDate(res.data.dateTimeRecycleable);
        setNonBioDate(res.data.dateTimeNonBio);
      } catch (error) {
        console.log("Error fetching trash dates:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-5 bg-blue-500 min-h-screen items-center justify-center">
      {!recycleableDate.length && !nonBioDate.length ? (
        <></>
      ) : (
        <>
          <div className="flex flex-col flex-grow w-full max-w-sm mx-auto mb-1 md:mb-4 p-3 h-fit rounded-2xl border bg-white border-white shadow-md">
            <div className="mb-2 p-3 h-fit rounded-2xl border bg-yellow-400 border-white shadow-md">
              <h1 className="text-2xl font-bold p-2 text-center text-black">
                SMART BIN HISTORY LOG
              </h1>
            </div>

            <div className="flex flex-row flex-grow w-full">
              {!recycleableDate.length ? (
                <></>
              ) : (
                <div className="rounded-2xl border flex flex-col flex-grow border-white overflow-hidden shadow-md">
                  
                  <button class="btn btn-primary font-bold text-lg hover:bg-white hover:border-white text-black mb-1 p-2 h-fit rounded-2xl border bg-yellow-400 border-white shadow-md"
                    onClick={() => { navigate(`/api/rec`) }}>
                      RECYCLEABLE
                  </button>
                  <table className="bg-gray-800 table-auto border w-full">
                    <thead>
                      <tr>
                        <th className="border text-base px-2 py-1 w-fit text-white">
                          NO
                        </th>
                        <th className="border text-base px-2 py-1 w-full text-white">
                          DATE TIME
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recycleableDate.map((time, index) => (
                        <tr key={`time-${index}`} className="text-center">
                          <td className="border text-base px-2 py-1 text-white">
                            {index + 1}
                          </td>
                          <td className="border text-lg px-2 py-1 text-white">
                              <button class="btn btn-primary font-bold h-10 min-h-10 hover:text-white hover:bg-gray-800 hover:border-gray-800 text-black bg-yellow-400 border-gray-800 shadow-md"
                                onClick={() => { navigate(`/api/recycleable/${index}`) }}>
                                  {time}
                              </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {!nonBioDate.length ? (
                <></>
              ) : ( 
                <div className="rounded-2xl border flex flex-col flex-grow border-white overflow-hidden shadow-md">
                  <button class="btn btn-primary font-bold text-lg hover:bg-white hover:border-white text-black mb-1 p-2 h-fit rounded-2xl border bg-yellow-400 border-white shadow-md"
                    onClick={() => { navigate(`/api/non`) }}>
                      NON BIO
                  </button>
                  <table className="bg-gray-800 table-auto border w-full">
                    <thead>
                      <tr>
                        <th className="border text-base px-2 py-1 w-fit text-white">
                          NO
                        </th>
                        <th className="border text-base px-2 py-1 w-full text-white">
                          DATE TIME
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {nonBioDate.map((time, index) => (
                        <tr key={`time-${index}`} className="text-center">
                          <td className="border text-base px-2 py-1 text-white">
                            {index + 1}
                          </td>
                          <td className="border text-lg px-2 py-1 text-white">
                            <button class="btn btn-primary font-bold h-10 min-h-10 hover:text-white hover:bg-gray-800 hover:border-gray-800 text-black bg-yellow-400 border-gray-800 shadow-md"
                                onClick={() => { navigate(`/api/nonBio/${index}`) }}>
                                  {time}
                              </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>


          </div>
        </>
      )}
      
    </div>
  );
};

export default Home;
