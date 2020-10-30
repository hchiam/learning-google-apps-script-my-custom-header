// TODO:
// 1) install a trigger at https://script.google.com to run emailAtMostOnceADay "From spreadsheet" and "On edit" (or "On form submit" if the sheet was associated with a form).
// 2) install a trigger at https://script.google.com to run resetEmailCount with a "Time-driven" trigger on a "Day timer".
// 3) set the counter cell sheet and address, and also the target email:
const counterCellAddress = "A1"; // <-- edit this!
const counterCellSheetName = "Counter Sheet"; // <-- edit this!
const targetEmailAddress = "...@gmail.com"; // <-- edit this! (make sure it's an email you're allowed to send to)

//// This function might not work with your permissions, so you might have to install a trigger instead anyways:
//function onEdit(event) {
//  if (!alreadySentEmailToday()) email();
//}

function emailAtMostOnceADay() {
  if (!alreadySentEmailToday()) {
    email();
    setLastDateCellValue(new Date());
  }
}

function email() {
  const emailTo = targetEmailAddress;
  const emailSubject = "test email";
  const emailBody = `Hi! 

This is an automated message: 

Someone edited the form or Google sheet today! 

See the Google sheet here: ...
`;
  GmailApp.sendEmail(emailTo, emailSubject, emailBody);
}

function alreadySentEmailToday() {
  const todaysDateString = getTodaysDate();
  const lastDateString = getLastDateCellValue();
  return todaysDateString === lastDateString;
}

function alreadyIncrementedCountToday() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    counterCellSheetName
  );
  const counterCell = sheet.getRange(counterCellAddress);
  counterCell.setValue(counterCell.getValue() + 1);
  return counterCell.getValue() > 1;
}

function getTodaysDate() {
  return Utilities.formatDate(new Date(), "GMT-4", "dd/MM/yyyy");
}

function getLastDateCellValue() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    counterCellSheetName
  );
  const lastDateCell = sheet.getRange(lastDateCellAddress);
  const cellValue = lastDateCell.getValue();
  if (isValidDate(cellValue)) {
    return Utilities.formatDate(cellValue, "GMT-4", "dd/MM/yyyy");
  }
  return "";
}

function isValidDate(value) {
  const isDateObject =
    Object.prototype.toString.call(value) === "[object Date]";
  if (!isDateObject) return false;
  const canGetTime = !isNaN(value.getTime());
  return canGetTime;
}

function setLastDateCellValue(date) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    counterCellSheetName
  );
  const lastDateCell = sheet.getRange(lastDateCellAddress);
  lastDateCell.setValue(date);
}

// add a trigger to run this once a day:
function resetEmailCount() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    counterCellSheetName
  );
  const counterCell = sheet.getRange(counterCellAddress);
  counterCell.setValue(0);
}
