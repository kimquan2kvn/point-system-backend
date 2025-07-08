import IUserRepository from "../authentication.repository";
import { SequelizeBaseRepository } from "../baseRepository";

class SequelizeUserRepository
  extends SequelizeBaseRepository
  implements IUserRepository {}

export default SequelizeUserRepository;
