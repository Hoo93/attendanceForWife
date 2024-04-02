import { Enum, EnumType } from 'ts-jenum';

@Enum('code')
export class ELoginType extends EnumType<ELoginType>() {
  static readonly GENERAL = new ELoginType('GENERAL', '일반로그인');
  static readonly KAKAO = new ELoginType('KAKAO', '카카오로그인');

  private constructor(
    readonly _code: string,
    readonly _name: string,
  ) {
    super();
  }

  get code(): string {
    return this._code;
  }

  get name(): string {
    return this._name;
  }
}
