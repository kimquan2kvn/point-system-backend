import { isEmpty } from "lodash";
import { UserModel } from "../models/authenticationModel";
import IUserRepository from "../repositories/authentication.repository";
import { createError } from "@fastify/error";
import { EnumRole } from "../util/enum/role";
const bcrypt = require("bcryptjs");

const error = createError("404", "Tài khoản hoặc mật khẩu không đúng");
const errorInfo = createError("404", "User not found");
const errorRole = createError("400", `Bạn không có quyền`);

class AuthenticationService {
  constructor(private authentionRepository: IUserRepository) {}

  async getInfo(id: string) {
    const user: any = await this.authentionRepository.findById(id);

    if (!user) {
      throw new errorInfo();
    }

    return user;
  }
  async login(userName: string, password: string) {
    const user: any = await this.authentionRepository.findByAttributes({
      user_name: userName,
    });

    if (!user) {
      throw new error();
    }

    const checkPass = bcrypt.compareSync(password, user.password);

    if (!checkPass) {
      throw new error();
    }

    return {
      id: user.id,
      user_name: user.user_name,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async createUser(userName: string, password: string, name: string) {
    const salt = bcrypt.genSaltSync(10);
    const encodePass = bcrypt.hashSync(password, salt);

    const user: any = await this.authentionRepository.findByAttributes({
      user_name: userName,
    });

    if (user) {
      const errorCreate = createError(
        "400",
        `Mã sinh viên ${userName} đã tồn tại`
      );
      throw new errorCreate();
    }

    return await this.authentionRepository.create({
      user_name: userName,
      password: encodePass,
      name: name,
    } as UserModel);
  }

  async createMultipleUsers(
    students: { id: string; name: string }[],
    role: number
  ) {
    if (role !== EnumRole.PHONG_DAO_TAO) {
      throw new errorRole();
    }

    const salt = bcrypt.genSaltSync(10);
    const listStudents = students.map((e) => ({
      user_name: e.id,
      password: bcrypt.hashSync(e.id, salt),
      name: e.name,
    }));

    const users: any = await this.authentionRepository.findAll({
      where: {
        user_name: listStudents.map((e) => e.user_name),
      },
    });

    if (!isEmpty(users)) {
      const errorCreateMulti = createError(
        "400",
        `Mã sinh viên ${users
          .map((e: any) => e.user_name)
          .toString()} đã tồn tại`
      );
      throw new errorCreateMulti();
    }

    return await this.authentionRepository.bulkCreate(listStudents);
  }

  async getUsers(role?: number) {
    const users: any = await this.authentionRepository.findAll(
      role
        ? {
            where: {
              role: role,
            },
          }
        : {}
    );

    return users;
  }

  async updateUser(id: string, name: string, role: number) {
    return await this.authentionRepository.update(
      { name, role },
      {
        where: {
          id,
        },
      }
    );
  }
  async deleteUser(id: string) {
    return await this.authentionRepository.destroy({ id });
  }
}

export default AuthenticationService;
