import axios from "axios";
import { useEffect, useState } from "react";
import { getEmail } from "../helper/helper";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;


/** cuatom hook */
export default function useFetch(query) {
    const [getData, setData] = useState({ isLoading: false, apiData: undefined, status: null, serverError: null })
    useEffect(() => {

        if (!query) return;

        const fetchData = async () => {
            try {
                setData(prev => ({ ...prev, isLoading: true }))

                const { email } = !query ? await getEmail() : '';
                
                const { data, status } = !query ? await axios.get(`/api/user/${email}`) : await axios.get(`/api/${query}`);


                setData(prev => ({ ...prev, isLoading: false, apiData: data, status }))

                setData(prev => ({ ...prev, isLoading: false }))

            } catch (error) {
                setData(prev => ({ ...prev, isLoading: false, serverError: error }))
            }
        }

        fetchData()

    }, [query])

    return [getData, setData];
};
