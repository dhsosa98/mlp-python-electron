import axios from 'axios'
// import { getSock } from '../utils/sock'

export class Api {
   
   public static async getMatrixDistortioned(matrix: any, distortion: number){
      const response = await axios.post('http://localhost:8000/distortion_matrix', { matrix, distortion })
      return response.data
   }

   public static async getMLPAnswer(matrix: any){
      const response = await axios.post('http://localhost:8000/mlp_answer', { matrix })
      return response.data
   }

}

