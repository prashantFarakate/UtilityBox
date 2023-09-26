import { Component,ViewChild, ElementRef, OnDestroy, OnInit } from '@angular/core';
import * as FileSaver from 'file-saver';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RoiComponent } from './roi/roi.component';

import { JsonDataService } from './json-data.service';
import { ReComponent } from './re/re.component';
import { ParseSpan } from '@angular/compiler';


@Component({
  selector: 'app-create-template',
  templateUrl: './create-template.component.html',
  styleUrls: ['./create-template.component.css']
})
export class CreateTemplateComponent implements OnInit, OnDestroy{
  subscription: any;

  // constructor(private router: Router ){}

  constructor(private matdialog: MatDialog ,
    private jsonDataService: JsonDataService  // Inject the service
    ){}


  // ngOnDestroy(): void {
  //   throw new Error('Method not implemented.');
  // }

  roi() {
    this.matdialog.open(RoiComponent, {     //added component 
      width : '1000px',
      height: '550px',
      disableClose: true,
    });
  }


  re(){
    this.matdialog.open(ReComponent,{
      width:'900px',
      height:'550px',
      disableClose:true,
    })
  }
  // ngOnInit(){

    // this.jsonDataService.boxGeo.subscribe((receivedMsg)=>{
    //   alert('new');
    //   this.addBoxGeometry(receivedMsg);
      

    // this.jsonDataService.boxGeo.subscribe(()=>{
    //   this.addBoxGeometry();
  //   })
  // }
  ngOnInit() {
    this.subscription = this.jsonDataService.pathsAndBoxes$.subscribe(data => {
      if (data) {
        const { paths, boxes } = data;
        // Use paths and boxes here in your target function
        
        this.addBoxGeometry(paths, boxes);
      }
    });

    this.subscription = this.jsonDataService.pathAndRegex$.subscribe(data => {
      if (data){
        const { Path, InputValues} = data;

        this.addRegEx(Path, InputValues);
      }
    });

    // Moved the if statement here
      //   if (this.templateObject[0].Page.length > 0) {
      //     this.isPageExist = true;
      // } else {
      //     this.isPageExist = false;
      // }
  }
  // addRegEx(Path: string[], InputValues: string[]) {
  //   throw new Error('Method not implemented.');
  // }
  


  // roi(){
  //   alert("ROI")
  //   this.router.navigate(['/create-template/roi']);
  //   // alert("ROI2")
    
  // }

  templateFormVisible = false;

  templateObject: { 
    DocumentTypeId: string;
    TemplateID: string;
    Page: any[];
    ConfidenceScore: number;
  }[] = [];

  // to make Select page and add fields visible
  get isPageExist(): boolean {
    return this.templateObject && 
           this.templateObject.length > 0 && 
           this.templateObject[0].Page && 
           this.templateObject[0].Page.length > 0;
  } 


  documentTypeId: string ='';
  pageID: string = '';
  startReg: string = '';
  endReg: string = '';
  pageIndex: number = 0;
  selectPageIndex: number = 0;
  fieldName: string ='';
  paraType: string = '';
  isColumnTableVisible = false
  columnName : string = '';
  _paraType : string = '';
  tableIndex: number = 0;
  

  @ViewChild('jsonOutput') jsonOutput!: ElementRef;
  @ViewChild('msg') msg!: ElementRef;
  @ViewChild('typeMsg') typeMsg!: ElementRef;
  @ViewChild('_typeMsg') _typeMsg!: ElementRef;
  


  addDocument(){
    // alert("add doc")
    
      var jsonObject = {
        "DocumentTypeId": this.documentTypeId,
        "TemplateID": "123",
        "Page": [],
        "ConfidenceScore": 90.00
      };

      // Add the document data to the array only once
      if (this.templateObject.length === 0 ){
          this.templateObject.push(jsonObject);
      }
      else{
          alert("The document has already been added")
      }

      var jsonString = JSON.stringify(this.templateObject[0], null, 2);
      this.jsonOutput.nativeElement.innerHTML = jsonString;

      // the shared jsonOutput value in the service
      this.jsonDataService.changeJsonOutput(jsonString);

      // Output or submit the JSON
      console.log(jsonString);
  }


  deleteDocument(){
    let confirmation = confirm("Are you sure you want to delete Document?");

    if (confirmation){
      this.templateObject.splice(0, 1);

      var jsonString = JSON.stringify(this.templateObject[0], null, 2);
      this.jsonOutput.nativeElement.innerHTML = jsonString;

      // the shared jsonOutput value in the service
      this.jsonDataService.changeJsonOutput(jsonString);
    }
  }

  pageNation(){
    
    var page = {
      // "PageID": String(this.pageID),
      "PageID": this.pageID !== null ? String(this.pageID) : "",
      "StartReg": this.startReg,
      "EndReg": this.endReg,
      "Fields": [],
      "Tables":[]
      };

    //   adding page dictionary to TemplateObject array
    this.templateObject[0].Page.push(page);

    //  to get the value to HTML page
    var jsonString = JSON.stringify(this.templateObject[0], null, 2);
    this.jsonOutput.nativeElement.innerHTML = jsonString;

    // the shared jsonOutput value in the service
    this.jsonDataService.changeJsonOutput(jsonString);
  }

  deletePage(pageIndex: number){
    var confirmation = confirm('Are you sure you want to delete this page?');

    if (confirmation){
      this.templateObject[0].Page.splice(pageIndex, 1);
      var jsonString = JSON.stringify(this.templateObject[0], null, 2);
      this.jsonOutput.nativeElement.innerHTML = jsonString;
      // document.getElementById('jsonOutput').innerHTML = jsonString;

      // the shared jsonOutput value in the service
      this.jsonDataService.changeJsonOutput(jsonString);

      console.log(jsonString);
    }
  }

  addField(){
    // alert("hii")
    let page = this.templateObject[0].Page[this.pageIndex];
    console.log(page);

    var fields =
        {
          "FieldName": this.fieldName,
          "Type": this.paraType
        }

    // var tables =
    //     {
    //       "TableName": this.fieldName
    //     }
    
    var tables =
        {
          "TableName": this.fieldName,
          "ExtractionParserType": {
            "Type": "",
            "PaserInput": {
              "HasHeader": true,
              "ColumnConfiguration": []
            }
          }
        }

    var allTable = 
        {
          "TableName": this.fieldName+"_AllTable-",
          "ExtractionParserType": {
            "Type": "TableREExtractor",
            "PaserInput": {
              "StartRegEx": "",
              "EndRegEx": "",
              "HasHeader": true,
              "RowReg": "",
              "ColumnConfiguration": "*"
            }
          }
        }
        

    if (this.paraType === "Text" || this.paraType === "Number" || this.paraType === "Date" || this.paraType === "Boolean")
    {
      this.templateObject[0].Page[this.selectPageIndex].Fields.push(fields);
    }
    else if (this.paraType === "Table")
    {
      this.templateObject[0].Page[this.selectPageIndex].Tables.push(tables);
    }
    else if (this.paraType === "AllTable")
    {
      this.templateObject[0].Page[this.selectPageIndex].Tables.push(allTable);
    }
    else {
      // alert("Please provide a valid Parameter Type.");
      let msg = "Provide Paramter Type";
        this.typeMsg.nativeElement.innerHTML = msg;
        
        setTimeout(() => {
          this.typeMsg.nativeElement.innerHTML = ''; // this will clear the message after 2 seconds
      }, 900);
    }

    var jsonString = JSON.stringify(this.templateObject[0], null, 2);
    this.jsonOutput.nativeElement.innerHTML = jsonString;

    // the shared jsonOutput value in the service
    this.jsonDataService.changeJsonOutput(jsonString);
  }

  // toggleColumnTableVisibility() {
  //   this.isColumnTableVisible = !this.isColumnTableVisible;
  //   this.tableIndex
  // }

//   toggleColumnTableVisibility(tableIndex: number) {
//     this.isColumnTableVisible = !this.isColumnTableVisible;
//     this.tableIndex = tableIndex;
// }

toggleColumnTableVisibility(tableIndex: number) {
  // If the tableIndex is different, just update the index and ensure the table is visible
  if (this.tableIndex !== tableIndex) {
    this.tableIndex = tableIndex;
    this.isColumnTableVisible = true;
  } 

  // else if (this.templateObject[0].Page){

  // }
  // If the tableIndex is the same, toggle the visibility
  else {
    this.isColumnTableVisible = !this.isColumnTableVisible;
  }
}

  addColumn(){
    // this.isColumnTableVisible = true;
    // this.isColumnTableVisible = !this.isColumnTableVisible;
    // alert("Hii")

    // let page = this.templateObject[0].Page[this.selectPageIndex].Tables[0];
    let page = this.templateObject[0].Page[this.selectPageIndex].Tables[this.tableIndex];
    console.log(page);    

    var columnConfig =
    {
      "ColumnName": this.columnName,
      "Type": this._paraType,
    }

    if (this._paraType!=""){
      this.templateObject[0].Page[this.selectPageIndex].Tables[this.tableIndex].ExtractionParserType.PaserInput.ColumnConfiguration.push(columnConfig);
    }
    else{
      // alert("Please add Paratype");
      let msg = "Provide Parameter Type";
        this._typeMsg.nativeElement.innerHTML = msg;
        setTimeout(() => {
          this._typeMsg.nativeElement.innerHTML = ''; // this will clear the message after 2 seconds
      }, 900);

    }

    // this.templateObject[0].Page[this.selectPageIndex].Tables[0].ExtractionParserType.PaserInput.ColumnConfiguration.push(columnConfig);
    // this.templateObject[0].Page[this.selectPageIndex].Tables[this.tableIndex].ExtractionParserType.PaserInput.ColumnConfiguration.push(columnConfig);

    var jsonString = JSON.stringify(this.templateObject[0], null, 2);
    this.jsonOutput.nativeElement.innerHTML = jsonString;

    // the shared jsonOutput value in the service
    this.jsonDataService.changeJsonOutput(jsonString);
  }



  copyToClipboard() {
    const textToCopy = this.jsonOutput.nativeElement.innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {

        console.log('Copying to clipboard was successful!');
        let msg = "Copied successfully!";
        this.msg.nativeElement.innerHTML = msg;
        setTimeout(() => {
          this.msg.nativeElement.innerHTML = ''; // this will clear the message after 2 seconds
      }, 800);

    }, err => {
        console.error('Could not copy text: ', err);
    });
}


downloadData() {
    const data = this.jsonOutput.nativeElement.innerText;
    // const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
    const blob = new Blob([data], { type: 'application/json' });
    FileSaver.saveAs(blob, 'Template.json');
}


// addBoxGeometry(paths: string[], boxes: { left: number, top: number, width: number, height: number }[]) {
//   alert("Hii Box");

//   console.log(paths)

//   this.templateObject[0].Page[0].Fields[0].FieldName

//   var parserInput_FROI = {
//     "ExtractionParser": [
//       {
//         "Type": "ROIExtractor",
//         "PaserInput": {
//           "Height": 0.0092,
//           "Width": 0.0791,
//           "Top": 0.1020,
//           "Left": 0.4605
//         }
//       }
//     ]
//   }
// }

addRegEx(Path: string[], InputValues: string[]) {
  // throw new Error('Method not implemented.');
  
  console.log("in the method")

  InputValues.forEach((value, index) =>{

    let path = Path[index];
    let parts = path.split('.');

    let pageIndex = parseInt(parts[1]);
    let fieldIndex = parseInt(parts[3]);

    console.log("divided into parts")

    // to add re fields
    if (parts.length === 5 && parts[2] === "Fields" && value!=''){

      let field = this.templateObject[0].Page[pageIndex].Fields[fieldIndex];

      console.log(field)

      field.ExtractionParser = [
        {
          "Type": "REExtractor",
          "PaserInput": {
            "regtext": value
          }
        }
      ];

      console.log(this.templateObject[0].Page[pageIndex].Fields[fieldIndex])
      console.log("added")
      console.log(this.templateObject[0])

    }

    // to add re tables
    else if(parts.length === 7 && parts[2] === "Tables") {
      let pageIndex = parseInt(parts[1]);
      let tableIndex = parseInt(parts[3]);
      let key = parts[6]
      console.log("prts")
      console.log(parts)
            
      // to add Extraction type 
      let type = this.templateObject[0].Page[pageIndex].Tables[tableIndex].ExtractionParserType
      type.Type = "TableREExtractor";

      // to add whole table Geometry
      let table = this.templateObject[0].Page[pageIndex].Tables[tableIndex].ExtractionParserType.PaserInput
      
      if (key==="StartRegEx"){
        table.StartRegEx = value;
      }
      else if (key==="EndRegEx"){
        table.EndRegEx = value;
      }
      else if(key==="RowReg"){
        table.RowReg = value;
      }
      else{
        console.log("Error Occured while adding Keys");
      }

      // table.StartRegEx = value;
              
      // Ensure keys at the start
      this.templateObject[0].Page[pageIndex].Tables[tableIndex].ExtractionParserType.PaserInput = {
        "StartRegEx": value,
        "EndRegEx": value,
        "RowReg": value,
        ...table
      };
      
    }

    // to add re columns
    else if(parts.length > 7 && parts[2] === "Tables") {
      let pageIndex = parseInt(parts[1]);
      let tableIndex = parseInt(parts[3]);
      let columnIndex = parseInt(parts[7])
      
      // add columns
      let column = this.templateObject[0].Page[pageIndex].Tables[tableIndex].ExtractionParserType.PaserInput.ColumnConfiguration[columnIndex];
    
      column.RegEx = value;
    }


    else if (parts.length > 7 && parts[2] === "Tables" ) {
      let pageIndex = parseInt(parts[1]);
      let tableIndex = parseInt(parts[3]);
      let key = parts[6]
            
      // to add Extraction type 
      // let type = this.templateObject[0].Page[pageIndex].Tables[tableIndex].ExtractionParserType
      // type.Type = "TableREExtractor";

      // to add whole table Geometry
      let table = this.templateObject[0].Page[pageIndex].Tables[tableIndex].ExtractionParserType.PaserInput
      
      if (key==="StartRegEx"){
        table.StartRegEx = value;
      }
      else if (key==="EndRegEx"){
        table.EndRegEx = value;
      }
      // else if(key==="RowReg"){
      //   table.RowReg = value;
      // }
      else{
        console.log("Error Occured while adding Keys");
      }
    }
    else{
      console.log("Error occured while adding Regex");
    }



  });

  
  
  let jsonString = JSON.stringify(this.templateObject[0], null, 2);
  this.jsonOutput.nativeElement.innerHTML = jsonString;
}


addBoxGeometry(paths: string[], boxes: string[]) {
  // { left: number, top: number, width: number, height: number }[]
  
  // paths.forEach((path, index)
  console.log("in the addBoxMethod")
  console.log(boxes)
  
  boxes.forEach((boxx, index)=> {

    //checking for empty value 
    if (boxx!=''){

    let path = paths[index]
    let parts = path.split('.'); // e.g. "Page.0.Fields.0.FieldName"

    let pageIndex = parseInt(parts[1]);
    let fieldIndex = parseInt(parts[3]);

    const [left, top, width, height] = boxx.split(',').map(part => {
      const [, val] = part.split('=');
      return parseFloat(val);
    });

    const box = { left, top, width, height };

    // to add Field ROI
    if (parts.length === 5 && parts[2] === "Fields") {
      
      let field = this.templateObject[0].Page[pageIndex].Fields[fieldIndex];
      
      // Add the ExtractionParser for Fields
      field.ExtractionParser = [
        {
          "Type": "ROIExtractor",
          "PaserInput": {
            "Left": box.left,
            "Top": box.top,
            "Width": box.width,
            "Height": box.height            
          }
        }
      ];

    }

    // to add whole table Geometry
    else if(parts.length === 5 && parts[2] === "Tables") {
      let pageIndex = parseInt(parts[1]);
      let tableIndex = parseInt(parts[3]);
      
      // to add Extraction type 
      let type = this.templateObject[0].Page[pageIndex].Tables[tableIndex].ExtractionParserType
      type.Type = "TableROIExtractor";

      // to add whole table Geometry
      let table = this.templateObject[0].Page[pageIndex].Tables[tableIndex].ExtractionParserType.PaserInput

      table.Geometry = [
        box.left,
        box.top,
        box.width,
        box.height
      ]   
      
      // Ensure Geometry is at the start
      this.templateObject[0].Page[pageIndex].Tables[tableIndex].ExtractionParserType.PaserInput = {
        "Geometry": [
          box.left,
          box.top,
          box.width,
          box.height
        ],
        ...table
      };
      
    }

    // to add Columns
    else if(parts.length > 7 && parts[2] === "Tables") {
      let pageIndex = parseInt(parts[1]);
      let tableIndex = parseInt(parts[3]);
      let columnIndex = parseInt(parts[7])
      
      // add columns
      let column = this.templateObject[0].Page[pageIndex].Tables[tableIndex].ExtractionParserType.PaserInput.ColumnConfiguration[columnIndex];
    
      column.Box =  [
            box.left,
            box.top,
            box.width,
            box.height       
      ]
    }


  }
  else{
    console.log("Not Added as input was empty string")
  }
  });



  // addRegex(Path: string[], InputValue:[]){

  // }

  // addRegEx(Path: string[], InputValues: string[]) {
  //   throw new Error('Method not implemented.');
  // }
  

  // Now, update the displayed JSON
  let jsonString = JSON.stringify(this.templateObject[0], null, 2);
  this.jsonOutput.nativeElement.innerHTML = jsonString;

  // And share it using the service
  // this.jsonDataService.changeJsonOutput(jsonString);    //commented to avoid input duplication


}















ngOnDestroy() {
  // Cleanup the subscription
  if (this.subscription) {
    this.subscription.unsubscribe();
  }
}

}
function addRegEx(Path: any, arg1: any, InputValues: any, arg3: any) {
  throw new Error('Function not implemented.');
}

