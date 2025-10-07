import { Role } from "@/types/role";
import { Outlet } from "./outlet";

export class User {
  id: string;
  email: string;
  name: string;
  role: Role;
  outlet: Outlet;

  constructor(params: {
    id: string;
    email: string;
    name: string;
    role: Role;
    outlet: Outlet;
  }) {
    this.id = params.id;
    this.email = params.email;
    this.name = params.name;
    this.role = params.role;
    this.outlet = params.outlet;
  }

  static fromJson(data: {
    id: string;
    email: string;
    name: string;
    role: Role;
    outlet: Outlet;
  }): User {
    return new User({
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
      outlet: data.outlet,
    });
  }
}
