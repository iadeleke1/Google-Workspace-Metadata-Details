/* Change the FOLDER NAME to generate tree for any specify folder */

var total_folders = 0;
var total_files = 0;
var time = 0;
var table = [];

var sheet = SpreadsheetApp.openById('1D3I7xj2rymmSwSyPEGiZSef5HLVOaBYkYB87ph4Ffqk').getActiveSheet();
var row = 1;
var col = 1;
var start = new Date();

function generateFolderTree() {
  try {

    // If you want a tree of any sub folder
    //var parent = DriveApp.getFoldersByName("FOLDER_NAME").next();

    // If you want to search from the top (root) folder
    var parentFolder = DriveApp.getRootFolder();

    getChildFolders(parentFolder);

    //test_sheet = SpreadsheetApp.openById('1OjKZB0otTIW3qCH9uoosA4xGaa16fKeBpm51GaWUlS0').getActiveSheet();
    for(var i = 0; i < table.length; i++){
      for(var j = 0; j < 17; j++){
        sheet.getRange(i+2, j+1).setValue(table[i][j]).setWrap(true);
      }
    }
  } catch (e) {
    Logger.log(e.toString());
  }
}

function getChildFolders(parent) {
  var childFolders = parent.getFolders();

  while (childFolders.hasNext()) {

    var childFolder = childFolders.next();

    total_folders++;
    row++

    //Check if the folder has already been listed on the spreadsheet
      //Get the list of Editors and Viewers
      var editors = childFolder.getEditors();
      var viewers = childFolder.getViewers();
      var editors_email = "";
      var viewers_email = "";
      for (var i = 0; i < editors.length; i++) {
        editors_email = editors_email + " " + editors[i].getEmail();
      }

      for (var i = 0; i < viewers.length; i++) {
        viewers_email = viewers_email + " " + viewers[i].getEmail();
      }
        //Push folder details to array

    table.push([childFolder.getName(), childFolder.getOwner().getEmail(),editors_email, viewers_email, childFolder.getDateCreated(),childFolder.getLastUpdated(),childFolder.getSize() + "",childFolder.getUrl(), "", "", "", "", "", "", "", ""]);
    //}

    //Check if script is close to timing out, if so put the script to sleep and have it continue after 5 minutes
    if (isTimeUp(start)){
      Logger.log("Time up");
      Utilities.sleep(5 * 1000)
      start = new Date();
    }

    var files = childFolder.getFiles();

    while (files.hasNext()) {

      // Print list of files inside the folder
      //Logger.log(files.next().getName());

      file = files.next();

      total_files++;
      row++

      //var all_ready_in_sheet_url_check = sheet.createTextFinder(file.getUrl());
      //var all_ready_in_sheet_name_check = sheet.createTextFinder(file.getName());

      //if (! all_ready_in_sheet_url_check.findNext() && ! all_ready_in_sheet_name_check.findNext()){

        //Get the list of Editors and Viewers
        var editors = file.getEditors();
        var viewers = file.getViewers();
        var editors_email = "";
        var viewers_email = "";
        for (var i = 0; i < editors.length; i++) {
          editors_email = editors_email + " " + editors[i].getEmail()
        }

        for (var i = 0; i < viewers.length; i++) {
          viewers_email = viewers_email + " " + viewers[i].getEmail()
        }

        //Write file details to Spreadsheet
        //sheet.getRange(row, 9).setValue(file.getName()).setWrap(true);
        //sheet.getRange(row,10).setValue(file.getOwner().getName()).setWrap(true);
        //sheet.getRange(row,11).setValue(editors_email).setWrap(true);
        //sheet.getRange(row,12).setValue(viewers_email).setWrap(true);
        //sheet.getRange(row,13).setValue(file.getDateCreated()).setWrap(true);
        //sheet.getRange(row,14).setValue(file.getLastUpdated()).setWrap(true);
        //sheet.getRange(row,15).setValue(file.getSize()).setWrap(true);
        //sheet.getRange(row,16).setValue(file.getUrl()).setWrap(true);
      //}

          //Check if script is close to timing out, if so put the script to sleep and have it continue after 5 minutes

      table.push(["", "", "", "", "", "", "", "",childFolder.getName(), file.getName(),file.getOwner().getEmail(),editors_email, viewers_email, file.getDateCreated(), file.getLastUpdated(), file.getSize() + "", file.getUrl()  ] )
    }

    if (isTimeUp(start)){
      Logger.log("Time up");
      Utilities.sleep(5 * 1000)
      start = new Date();
    }
    // Recursive call for any sub-folders
    getChildFolders(childFolder);
  }
}

function write_to_spreadsheet(){
  var sheet = SpreadsheetApp.openById('1D3I7xj2rymmSwSyPEGiZSef5HLVOaBYkYB87ph4Ffqk').getActiveSheet();
  sheet.clear();
  sheet.getRange(1,1).setValue('Folder Name').setWrap(true);
  sheet.getRange(1,2).setValue('Folder Owner').setWrap(true);
  sheet.getRange(1,3).setValue('Folder Editors').setWrap(true);
  sheet.getRange(1,4).setValue('Folder Viewer').setWrap(true);
  sheet.getRange(1,5).setValue('Folder Date Created').setWrap(true);
  sheet.getRange(1,6).setValue('Folder Last Modified').setWrap(true);
  sheet.getRange(1,7).setValue('Folder Size').setWrap(true);
  sheet.getRange(1,8).setValue('Folder URL').setWrap(true);
  sheet.getRange(1, 9).setValue('File Parent Folder Name').setWrap(true);
  sheet.getRange(1, 10).setValue('File Name').setWrap(true);
  sheet.getRange(1,11).setValue('File Owner').setWrap(true);
  sheet.getRange(1,12).setValue('File Editiors').setWrap(true);
  sheet.getRange(1,13).setValue('File Veiwers').setWrap(true);
  sheet.getRange(1,14).setValue('File Date Created').setWrap(true);
  sheet.getRange(1,15).setValue('File Last Modified').setWrap(true);
  sheet.getRange(1,16).setValue('File Size').setWrap(true);
  sheet.getRange(1,17).setValue('File URL').setWrap(true);
}

function isTimeUp(start){
  var now = new Date();
  return now.getTime() - start.getTime() > 300000; // 5 minutes
}
