import { User } from '../users/entities/user.entity';
import { CreateAuthDto } from './dto/create-auth.dto';

export class MockUserRepository {
  private users: User[] = [];

  public save(createAuthDto: CreateAuthDto) {
    const { password, ...result } = createAuthDto;
    return result;
  }
}
