import userApi from "../Api/userApi";
import { GetCompany } from "../Utils/Types";

export async function getAllCompanies(): Promise<{data: GetCompany[]}> {
    try {
      const res = await userApi.get('/user/all/company');
      return res.data;
    } catch (err) {
      console.error('Error fetching companies:', err);
      throw err;
    }
};


export async function getCurrentCompant(): Promise<{data: GetCompany}> {
    try {
      const {data} = await userApi.get('/user/company');
      return {data: data.data[0]};
    } catch (err) {
      console.error('Error fetching company:', err);
      throw err;
    }
};
  

export async function createCompany(data: FormData): Promise<{status: boolean}>{
    try {
        console.log(data)
        const createRes = await userApi.post(`/user/create/company`, data);
  
        console.log("createCompany response", createRes);
  
        return {status: createRes.data.success === true} 
      } catch (error: any) {
        console.error('Error on creating', error)
        throw error
      }
}