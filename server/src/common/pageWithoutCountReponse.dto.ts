export class PageWithoutCountReponseDto<T> {
  count: number;
  items: T[];

  constructor(count: number, items: T[]) {
    this.count = count;
    this.items = items;
  }
}
