import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import webTablesPage from '../../pages/web-tables-page';
import { buildRecord, recordFromRow } from '../../factories/record-factory';

/*
 * Steps for: Web Tables.
 * The record being handled is kept in `this.record` (Cucumber World),
 * and the bonus records in `this.records`.
 */

// ---------- One record: create, edit, delete ----------

When('I create a new record with random data', function () {
  this.record = buildRecord();
  webTablesPage.addRecord(this.record);
});

When('I edit the record with random data', function () {
  const newData = buildRecord();
  webTablesPage.editRecord(this.record, newData);
  this.record = newData;
});

When('I delete the record', function () {
  webTablesPage.deleteRecord(this.record);
});

Then('the record should be displayed in the table', function () {
  webTablesPage.shouldShowRecord(this.record);
});

Then('the record should not be displayed in the table', function () {
  webTablesPage.shouldNotShowRecord(this.record);
});

// ---------- Bonus: many records from a data table ----------

When('I create the following records:', function (dataTable) {
  this.records = dataTable.hashes().map(recordFromRow);
  this.records.forEach((record) => webTablesPage.addRecord(record));
});

Then('all the created records should be displayed in the table', function () {
  this.records.forEach((record) => webTablesPage.shouldShowRecord(record));
});

When('I delete all the created records', function () {
  this.records.forEach((record, index) => {
    webTablesPage.deleteRecord(record);

    // Deleting one record must not remove the others (BUG-003, docs/bug-reports.md).
    const nextRecord = this.records[index + 1];
    if (nextRecord) {
      webTablesPage.shouldStillHaveRecord(nextRecord, record);
    }
  });
});

Then('none of the created records should be displayed in the table', function () {
  this.records.forEach((record) => webTablesPage.shouldNotShowRecord(record));
});
