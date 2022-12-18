import axios from 'axios'
// import { getSock } from '../utils/sock'

const baseUrl = 'http://localhost:8000/'
const headers = {
   'Content-Type': 'application/json',
}

export class Api {
   
   public static async getMatrixDistortioned(matrix: any, distortion: number){
      const response = await axios.post(baseUrl+'distort_matrix', { matrix, distortion }, { headers })
      return response.data
   }

   public static async getMLPAnswer(matrix: any, model: string){
      const response = await axios.post(baseUrl+'prediction', { matrix, model }, {headers})
      console.log(model)
      return response.data
   }

   public static async getMLPModels(){
      const response = await axios.get(baseUrl+'models', {headers})
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

   public static async getMLPModelInfo(model: string){
      const response = await axios.post(baseUrl+'model_attr', { model }, {headers})
      return response.data
   }

   public static async getAvailableMatrixes(){
      const response = await axios.get(baseUrl+'default_matrixes', {headers})
      return response.data
   }
}

