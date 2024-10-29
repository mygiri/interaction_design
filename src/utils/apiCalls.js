
import axios from "axios"
const apiHost ='localhost:5000'
const numDims = 5; // Set the number of dimensions for optimizer



//----------------------------reinitialize optimizer for a certain location-----------------------------------------------------------------------

const reinitializeOptimzer = async (userID,optimizer_index) =>{
    try{
  
      const response = await axios.get(`http://${apiHost}/reinitialize_optimizer/${userID}/${optimizer_index}`)
      console.log('optimzer reinitialized for:', optimizer_index)
  
    }catch(error){
      console.error('Error reinitalizing the Optimzer for location:', optimizer_index)
    }
  }



  export {
    reinitializeOptimzer,
  
  }
  