import axios from 'axios';

export const baseUrl='https://bayut.p.rapidapi.com'

export const fetchApi = async (url) =>{
    const {data} = await axios.get((url),{
        
        headers:{
            'x-rapidapi-host':'bayut.p.rapidapi.com',
            'x-rapidapi-key':'6e5af72813msh61ccab474951c38p1c6adbjsn9c163d0f878c'
        }
    })
    
return data;

    
}

