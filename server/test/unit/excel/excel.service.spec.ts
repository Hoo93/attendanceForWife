import { ExcelService } from '../../../src/common/excel.service';
import * as XLSX from 'xlsx';

describe('ExcelService Test', () => {
  let excelService: ExcelService;

  beforeEach(() => {
    excelService = new ExcelService();
  });
  describe('exportDataToExcel Test', () => {
    it('', () => {
      // Given
      const workBook = XLSX.utils.book_new();
      const worksheetName = 'Test Work Sheet';
      const data = [
        ['header_1', 'header_2'],
        ['row_1Col_1', 'row_1Col_2'],
        ['row_2Col_1', 'row_2Col_2'],
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(workBook, worksheet, worksheetName);
      const fileBuffer = XLSX.write(workBook, { bookType: 'xlsx', type: 'buffer' });

      const headerToDbMapper = { header_1: 'dbField_1', header_2: 'dbField_2' };

      // When
      const result = excelService.extractDataFromExcel(fileBuffer, headerToDbMapper);

      // Then
      expect(result).toEqual([
        { dbField_1: 'row_1Col_1', dbField_2: 'row_1Col_2' },
        { dbField_1: 'row_2Col_1', dbField_2: 'row_2Col_2' },
      ]);
    });
  });
});
