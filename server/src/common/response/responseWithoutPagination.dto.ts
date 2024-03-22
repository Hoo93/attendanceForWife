export class ResponseWithoutPaginationDto<T> {
  success: boolean;
  count: number;
  items: T[];

  constructor(count: number, items: T[], success = true) {
    this.count = count;
    this.items = items;
    this.success = success;
  }
}
