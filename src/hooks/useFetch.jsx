import React from 'react'
import { useState,useEffect } from 'react'
import { axiosInstance } from '../config/axiosInstance'

function useFetch(url) {

         const [data,setData]=useState({})
            const [isLoading, setLoading]= useState(true)
            const [error,setError]= useState(null)
            const fetchData= async ()=>{
                try {
        
                    const response = await axiosInstance({method:"GET",url: url})
                    setData(response?.data?.data)
                    setLoading(false)
                    
                } catch (error) {
                    console.log(error)
                    setError(error)
                }
            }
        useEffect(()=>{
           fetchData()
        },[])


  return [data,isLoading,error]
}

export default useFetch