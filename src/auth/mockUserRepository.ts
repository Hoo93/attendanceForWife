import { Repository } from "typeorm";
import { User } from "../users/entities/user.entity";
import { EntityManager } from "typeorm/entity-manager/EntityManager";
import { Inject, Injectable } from "@nestjs/common";

type MockRepository<T = any> = Partial<Record<keyof T, jest.Mock>>

@Injectable()
export class MockUserRepository {
  private users: User[] = [];

}