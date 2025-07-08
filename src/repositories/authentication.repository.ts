import { IBaseRepository } from "./baseRepository";
import { UserModel } from "../models/authenticationModel";

interface IUserRepository extends IBaseRepository<UserModel> {}

export default IUserRepository;
