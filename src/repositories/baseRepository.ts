import { Model } from "sequelize";

export interface IBaseRepository<T> {
  findByAttributes(attributes: object): Promise<Model>;
  create(payload: T): Promise<Model>;
  findById(id: string | number): Promise<Model>;
  findAll(object: object): Promise<Model>;
  update(objectupdate: object, object: object): Promise<Model>;
  destroy(object: object): Promise<Model>;
  bulkCreate(array: Array<any>): any;
}

export class SequelizeBaseRepository implements IBaseRepository<Model> {
  constructor(protected _model: any) {}
  async findByAttributes(attributes: object): Promise<Model> {
    return this._model.findOne({ where: attributes });
  }
  async create(payload: object): Promise<Model> {
    return this._model.create(payload);
  }
  async findById(id: string | number): Promise<Model> {
    return this._model.findByPk(id);
  }
  async findAll(object: object): Promise<Model> {
    return this._model.findAll(object);
  }
  async update(objectupdate: object, object: object): Promise<Model> {
    return this._model.update(objectupdate, object);
  }
  async destroy(object: object): Promise<Model> {
    return this._model.destroy({
      where: object,
    });
  }
  async bulkCreate(array: Array<any>): Promise<Model> {
    return this._model.bulkCreate(array);
  }
}
