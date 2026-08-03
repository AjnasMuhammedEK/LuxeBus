import { Model , QueryFilter , UpdateQuery , HydratedDocument } from "mongoose";

export class BaseRepositary <T> {
    
    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async create(data : Partial<T>):Promise<HydratedDocument<T>> {
        return await this.model.create(data)
    }

    async findOne(filter:QueryFilter<T>):Promise<HydratedDocument<T>|null>{
        return await this.model.findOne(filter)
    }

    async findAll (filter: QueryFilter<T> = {}): Promise<HydratedDocument<T>[]> {
        return await this.model.find(filter);
    }

    async findById(id: string): Promise<HydratedDocument<T> | null> {
        return await this.model.findById(id);
    }

    async updateOne(filter : QueryFilter<T> , update:UpdateQuery<T>):Promise<HydratedDocument<T>| null> {
        return await this.model.findOneAndUpdate(filter,update,{new:true})
    }

    async updateById (id:string,update:UpdateQuery<T>):Promise<HydratedDocument<T> |null>{
        return await this.model.findByIdAndUpdate(id , update,{new:true})
    }
}
