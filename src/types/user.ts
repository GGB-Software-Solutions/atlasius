import { Warehouse } from "../types";

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  warehouse: Warehouse;
  role: string;
}
