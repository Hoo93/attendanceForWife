export enum RoleType {
  MASTER = 'MASTER', // 마스터 관리자 (권한 부여 가능)
  MANAGER = 'MANAGER', // 상위 관리자
  GENERAL = 'GENERAL', // 일반 사용자
  READER = 'READER' // 읽기 권한 사용자
}
