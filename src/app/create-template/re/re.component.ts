import { Component } from '@angular/core';
import { JsonDataService } from '../json-data.service';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-re',
  templateUrl: './re.component.html',
  styleUrls: ['./re.component.css']
})
export class ReComponent {

  constructor(private dialogRef: MatDialogRef<ReComponent>, private jsonDataService:JsonDataService){}

  jsonString :any;
  jsonObject:any;

  labels : string[]=[];
  Path: string[]=[];
  inputValues : string[]=[];
  regEx : string[]=[];
  isItTable : string[]=[];

  selectedInputIndex: number | null = null;

  setSelectedInput(index: number) {
    this.selectedInputIndex = index;
  }

  // to get json in re component
  ngOnInit(){
    this.jsonDataService.currentJsonOutput.subscribe(json=>{
      // to get jsonstring from create-component forms (debugging)
      this.jsonString=json;
      // convert jsonstring to json object
      this.jsonObject = JSON.parse(this.jsonString)

      // to make explicite call
      this.findKeyInObject();

    });

    // to retrive the input values from the session storage
    this.labels.forEach((_, i) => {
      const savedValue = this.jsonDataService.getInputData(i);
      this.inputValues[i] = savedValue ? savedValue : '';
    });
  }

  close(){
    // alert("Hii");
    this.dialogRef.close();
  }

  save(){

    // to store input values to the session storage
    this.inputValues.forEach((value, i) => {
      this.jsonDataService.saveInputData(i, value);
    });
    
    console.log("this.jsonDataService",this.jsonDataService)

    this.inputValues.forEach((value, index) => {
      if (this.regEx[index]) {
        this.regEx[index] = value;
      } else {
          this.regEx.push(value);
      }

    });
    console.log(this.inputValues);
    // console.log("Hiiiiii")
    // console.log(this.regEx)

    this.jsonDataService.updatePathAndRegex(this.Path, this.inputValues)
  }


  // to get path for required keys 
  getPathsForKeys(json: any, keysToSearch: string[], currentPath: string = ''): { value: string, path: string }[] {
    let results: { value: string, path: string }[] = [];

    
    for (const key in json) {
        if (!json.hasOwnProperty(key)) continue;
        
        const newPath = currentPath ? `${currentPath}.${key}` : key;

        if (keysToSearch.includes(key)) {
            results.push({ value: json[key], path: newPath });
        }

        if (typeof json[key] === 'object' && json[key] !== null) {
            results = results.concat(this.getPathsForKeys(json[key], keysToSearch, newPath));
        }
    }
    return results;
}

  findKeyInObject(){
    const Keys = ["FieldName", "ColumnName"];
    const pathsAndValues = this.getPathsForKeys(this.jsonObject, Keys);
    console.log(pathsAndValues);

    pathsAndValues.forEach(item => {
      console.log(`Path: ${item.path}, Value: ${item.value}`);

      // append path of the value to Array
      // this.Path.push(item.path);
      // append value(keys) to the Array
      // this.labels.push(item.value);

      

      const parts = item.path.split('.');
      // console.log(parts);
      // this.Path.forEach((path, index) => {

      if (parts[2]==="Tables" && parts[4] === "ExtractionParserType"){
        const pageIndex = parts[1];
        const tableIndex = parts[3];
        
        const parserInput = this.jsonObject.Page[pageIndex].Tables[tableIndex].ExtractionParserType.PaserInput;
        // parserInput.StartRegEx = ""; 
        
        this.jsonObject.Page[pageIndex].Tables[tableIndex].ExtractionParserType.PaserInput ={
          "StartRegEx": "",
          "EndRegEx":"",
          "RowReg":"",
          ...parserInput
        }
          
        }    

  });

  // Update the jsonString after modifying jsonObject
  this.jsonString = JSON.stringify(this.jsonObject);

  const Keys1 = ["FieldName", "ColumnName", "StartRegEx", "EndRegEx", "RowReg" ];
  const pathsAndValues1 = this.getPathsForKeys(this.jsonObject, Keys1);
  console.log(pathsAndValues1);

    pathsAndValues1.forEach(item => {
      console.log(`Path: ${item.path}, Value: ${item.value}`);

      // append path of the value to Array
      this.Path.push(item.path);

      // append value(keys) to the Array
      // to add StartRegEx, EndRegEx, RowReg to labels

      if (item.path.slice(-10)==="StartRegEx"){
        this.labels.push("StartRegEx");
      }
      else if (item.path.slice(-8)==="EndRegEx") {
        this.labels.push("EndRegEx");
      }
      else if (item.path.slice(-6)==="RowReg") {
        this.labels.push("RowReg");
      }
      else{
        this.labels.push(item.value);
      }



      // to check table
      // if (item.path.slice(-9)==="TableName"){
      //   this.isItTable.push("Yes")
      // } 
      // else{
      //   this.isItTable.push("No")
      // }

    });
  }

}
