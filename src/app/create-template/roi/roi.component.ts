// import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Component, ViewChild, ElementRef, asNativeElements, OnInit } from '@angular/core';
import { JsonDataService } from '../json-data.service';
// import * as pdfjs from 'pdfjs-dist/webpack';
import * as pdfjs from 'pdfjs-dist';
import { EMPTY } from 'diffhtml/dist/typings/util/types';
// pdfjs.GlobalWorkerOptions.workerSrc = '/path/to/pdf.worker.js';





@Component({
  selector: 'app-roi',
  templateUrl: './roi.component.html',
  styleUrls: ['./roi.component.css']
})
export class RoiComponent implements OnInit {
  
  pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";

  
  // to create dialogRef property
  constructor(private dialogRef: MatDialogRef<RoiComponent>, private jsonDataService:JsonDataService) { 
    // this.imagePreview = '';
  }

  labels: string[] = [];
  paths : string[] = [];
  // box: string[] = [];
  box: { left: number, top: number, width: number, height: number }[] = [];
  inputValues : string[]=[];

  


  // to display on ui element
  jsonOutValue: string='';
  jsonObject: any;

  // to get the json in roi component
  ngOnInit() {
    this.jsonDataService.currentJsonOutput.subscribe(json => {
      // to get whole jsonstring
      this.jsonOutValue = json;
      console.log(this.jsonOutValue);

      // Parse JSON after getting/updating jsonOutValue
      this.parseJson();

      // Get keys and their path
      this.findKeyInObject(); 

    });
  }

  // to convert jsonstring to json object
  parseJson() {
    try {
        this.jsonObject = JSON.parse(this.jsonOutValue);
        // console.log("Hiii");
        console.log(this.jsonObject);
    } catch (error) {
        console.error("Error parsing JSON:", error);
    }
  }

  
  // to get keys and path
  findKeyValues(json: any, keysToSearch: string[], currentPath: string = ''): { value: any, path: string }[] {
    let results: { value: any, path: string }[] = [];

    for (const key in json) {
        const newPath = currentPath ? `${currentPath}.${key}` : key;
        // if (key === keyToSearch) {
        //     results.push({ value: json[key], path: newPath });
        // }

        if (keysToSearch.includes(key)) {
          results.push({ value: json[key], path: newPath });
        }
      
        if (typeof json[key] === 'object' && json[key] !== null) {
            results = results.concat(this.findKeyValues(json[key], keysToSearch, newPath));
        }
    }
    return results;
  }

  // A method to demonstrate the usage of findKeyValues
  findKeyInObject() {
    //to filter the json object by "FieldName"
    const keys = ["FieldName", "TableName", "ColumnName"]; 
    const values = this.findKeyValues(this.jsonObject, keys);
    console.log(values);

    // length of the filtered object
    // const length = Object.keys(values).length;
    // console.log("length og the fields: ",length);

        
    // Get the FieldName one by one
    // values.forEach((item, index) => {
      // console.log(`Value ${index + 1}: ${item.value}`);
      // const fieldName = item.value
      // console.log(fieldName)
    // });

    // Append FieldNames to Labels array
    values.forEach((item) => {
      this.labels.push(item.value);
    });

    //to get path
    values.forEach((item)=>{
      this.paths.push(item.path);
    })

    
    // values.forEach((item) => {
    //   if (!this.labels.includes(item.value)) {
    //     this.labels.push(item.value);
    //   }
    // });
  
    
    // for (let i = 0; i < length; i++) {
    //   console.log("HIIIII") 
    // }

    // console.log(values.value);
    // const vv = values[]
    // console.log(value);  

    // const v = JSON.stringify(values);
    // console.log(v);
  
  }



  close(): void {
    this.dialogRef.close();
  }

  // Add geometry to main json
  // save(){
  //   alert("Hii")
    
  //   // this.jsonDataService.boxGeometry();
  //   // this.jsonDataService.boxGeometry(msg);
  //   // const saveB ="save button";
  //   // this.box = [...this.boxGeometry];
    
  //   this.box.push(this.boxGeometry)
  //   console.log(this.box)
  // }

  save() {
    this.inputValues.forEach((value, index) => {

        const [left, top, width, height] = value.split(',').map(part => {
            const [, val] = part.split('=');
            return parseFloat(val);
        });

        const geometry = { left, top, width, height };

        // If the box array already has a value at this index, update it, else push a new value
        if (this.box[index]) {
            this.box[index] = geometry;
        } else {
            this.box.push(geometry);
        }

        // if (value === EMPTY | ''){
        //   this.box.push(EMPTY);
        // }
        // else{
        //   this.box.push(geometry);
        // }
        

        
    });
    console.log(this.box);
    console.log(this.inputValues);

    // Update the paths and box values in the service
    // const inputValues { left: number, top: number, width: number, height: number }[] = [];
    // this.inputValues = inputValuesNew
    this.jsonDataService.updatePathsAndBoxes(this.paths, this.inputValues);
  }




  zoomLevel: number = 1;  

  zoomIn() {
    this.zoomLevel += 0.05;
  }

  zoomOut() {
    this.zoomLevel -= 0.05;
    if (this.zoomLevel < 0.1) { // Prevent it from going too small
        this.zoomLevel = 0.1;
    }
  }


  @ViewChild('imageCanvas', { static: false }) canvas!: ElementRef;
  public context!: CanvasRenderingContext2D;
  private isDrawing = false;
  private startX: number=0;
  private startY: number=0;
  boxGeometry : any;
  image : any;

  loadImage(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = e => {
      
      const image = new Image();
      image.src = reader.result as string;
      image.onload = () => {

        this.canvas.nativeElement.width = image.width;
        this.canvas.nativeElement.height = image.height;

        // this.canvas.nativeElement.width = 800;
        // this.canvas.nativeElement.height = 600;

        this.context = this.canvas.nativeElement.getContext('2d');
        this.context.drawImage(image, 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      // to redraw the image
      this.image=image
      };
    };
    reader.readAsDataURL(file);
  }

//   loadFile(event: any): void {
//     const file = event.target.files[0];

//     if (!file) return;

//     if (file.type.startsWith('image/')) {
//         this.loadImage(file);
//     } else if (file.type === 'application/pdf') {
//         this.loadPDF(file);
//     } else {
//         console.warn('Unsupported file type');
//     }
// }

// loadImage(file: File): void {
//     const reader = new FileReader();
//     reader.onload = e => {
//         const image = new Image();
//         image.src = reader.result as string;
//         image.onload = () => {
//             this.canvas.nativeElement.width = image.width;
//             this.canvas.nativeElement.height = image.height;
//             this.context = this.canvas.nativeElement.getContext('2d');
//             this.context.drawImage(image, 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
//             this.image = image;
//         };
//     };
//     reader.readAsDataURL(file);
// }

// loadPDF(file: File): void {
//     const reader = new FileReader();
//     reader.onload = e => {
//         const pdfData = new Uint8Array(reader.result as ArrayBuffer);

//         // Using pdf.js to load the PDF
//         pdfjs.getDocument({ data: pdfData }).promise.then((pdf: { getPage: (arg0: number) => Promise<any>; }) => {
//             // For this example, we'll just render the first page of the PDF.
//             pdf.getPage(1).then(page => {
//                 const viewport = page.getViewport({ scale: 1.5 }); // You can adjust the scale as needed
//                 this.canvas.nativeElement.width = viewport.width;
//                 this.canvas.nativeElement.height = viewport.height;
//                 const renderContext = {
//                     canvasContext: this.canvas.nativeElement.getContext('2d'),
//                     viewport: viewport
//                 };
//                 page.render(renderContext);
//             });
//         });
//     };
//     reader.readAsArrayBuffer(file);
// }





  startDrawing(event: MouseEvent): void {
    this.isDrawing = true;
    this.startX = event.offsetX;
    this.startY = event.offsetY;
  }

  stopDrawing(event: MouseEvent): void {
    if (!this.isDrawing) return;

    this.isDrawing = false;
    const rectX = this.startX;
    const rectY = this.startY;

    // const rectWidth = event.offsetX - this.startX;
    // const rectHeight = event.offsetY - this.startY;

    // Save rectangle coordinates or process them as required
    // console.log(`Rectangle: x=${rectX}, y=${rectY}, width=${rectWidth}, height=${rectHeight}`);
    // this.boxGeometry = `Rectangle: x=${rectX}, y=${rectY}, width=${rectWidth}, height=${rectHeight}`;

    // left
    const normalizedStartX = this.startX / this.canvas.nativeElement.width;
    // top
    const normalizedStartY = this.startY / this.canvas.nativeElement.height;
    // width
    const normalizedWidth = (event.offsetX - this.startX) / this.canvas.nativeElement.width;
    // height
    const normalizedHeight = (event.offsetY - this.startY) / this.canvas.nativeElement.height;

    // Output the normalized coordinates and dimensions upto 10 decimals
    console.log(`Normalized Rectangle: left=${normalizedStartX.toFixed(10)}, top=${normalizedStartY.toFixed(10)}, width=${normalizedWidth.toFixed(10)}, height=${normalizedHeight.toFixed(10)}`);
    this.boxGeometry = `left=${normalizedStartX.toFixed(10)}, top=${normalizedStartY.toFixed(10)}, width=${normalizedWidth.toFixed(10)}, height=${normalizedHeight.toFixed(10)}`;
    
    // If an input box is selected, update its value with the new boxGeometry
    if (this.selectedInputIndex !== null) {
      this.inputValues[this.selectedInputIndex] = this.boxGeometry;
    }
  
  }

  drawRectangle(event: MouseEvent): void {
    if (!this.isDrawing) return;

    const currentX = event.offsetX;
    const currentY = event.offsetY;

    this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    // Redraw the image first
    this.context.drawImage(this.image, 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    this.context.beginPath();
    this.context.rect(this.startX, this.startY, currentX - this.startX, currentY - this.startY);
    this.context.stroke();
    this.context.strokeStyle = 'red';
    this.context.lineWidth = 3;
  }

  // inputValues: string[] = [];
  selectedInputIndex: number | null = null;

  setSelectedInput(index: number) {
    this.selectedInputIndex = index;
  }


//   setSelectedInput(index: number) {
//     this.selectedInputIndex = index;
//     // Assuming you want to auto-populate the selected input with boxGeometry value when clicked:
//     if (this.selectedInputIndex !== null) {
//         this.labels[this.selectedInputIndex] = this.boxGeometry;
//     }
// }





}
// function findKeyInObject(jsonObject: any, arg1: string) {
//   throw new Error('Function not implemented.');
// }

// function findKey() {
//   throw new Error('Function not implemented.');
// }

