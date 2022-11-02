import axios from 'axios'
// import { getSock } from '../utils/sock'

const baseUrl = 'http://localhost:8000/'
const headers = {
   'Content-Type': 'application/json',
}

export class Api {
   
   public static async getMatrixDistortioned(matrix: any, distortion: number){
      const response = await axios.post(baseUrl+'distortion_matrix', { matrix, distortion }, { headers })
      return response.data
   }

   public static async getMLPAnswer(matrix: any, model: string){
      if (model ==='model100.pickle'){
         model = 'A'
      }
      else if (model ==='model500.pickle'){
         model = 'B'
      }
      else if (model ==='model1000.pickle'){
         model = 'C'
      }
      const response = await axios.post(baseUrl+'mlp_answer', { matrix, model }, {headers})
      console.log(model)
      return response.data
   }

   public static async getMLPModels(){
      const response = await axios.get(baseUrl+'models', {headers})
      console.log(response.data)
      return response.data
   }

   public static async trainMLP(train: any){
      const response = await axios.post(baseUrl+'train_model', train, {headers})
      return response.data
   }

   public static async generateDatasets(type: string){
      console.log(type)
      const response = await axios.post(baseUrl+'generate_datasets', { type }, {headers})
      return response.data
   }

   public static async deleteMLPModel(model: string){
      const response = await axios.post(baseUrl+'delete_model', { model }, {headers})
      return response.data
   }

   public static async testMLPModel(model: string){
      const response = await axios.post(baseUrl+'test_model', { model }, {headers})
      return response.data
   }
}

