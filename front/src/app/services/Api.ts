import axios from 'axios'
// import { getSock } from '../utils/sock'

export class Api {
   
   public static async getMatrixDistortioned(matrix: any, distortion: number){
      const response = await axios.post('http://localhost:8000/distortion_matrix', { matrix, distortion })
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
      const response = await axios.post('http://localhost:8000/mlp_answer', { matrix, model })
      console.log(model)
      return response.data.class
   }

   public static async getMLPModels(){
      const response = await axios.get('http://localhost:8000/models')
      return response.data
   }

   public static async trainMLP(train: any){
      console.log(train)
      const response = await axios.post('http://localhost:8000/train_model', train)
      return response.data
   }

   public static async generateDatasets(type: string){
      const response = await axios.post('http://localhost:8000/generate_datasets', { type })
      return response.data
   }
}

