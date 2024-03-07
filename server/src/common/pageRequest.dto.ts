export abstract class PageRequestDto {
  pageNo: number;
  pageSize: number;

  getOffset() {
    return (this.pageNo - 1) * this.pageSize;
  }
  getLimit() {
    return this.pageSize;
  }
}
