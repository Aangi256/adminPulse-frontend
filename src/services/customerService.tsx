import axios from "axios";

const API = "http://localhost:5000/api/v1/customers";

export const getCustomers = () => axios.get(API);
export const createCustomer = (data: any) => axios.post(API, data);