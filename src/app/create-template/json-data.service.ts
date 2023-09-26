import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, distinctUntilChanged } from 'rxjs';
// import {}

@Injectable({
  providedIn: 'root'
})
export class JsonDataService {

  constructor() { }
  //from create-comp to roi
  private jsonOutputSource = new BehaviorSubject<string>("");
  // currentJsonOutput = this.jsonOutputSource.asObservable();
  currentJsonOutput = this.jsonOutputSource.asObservable().pipe(distinctUntilChanged());


  // changeJsonOutput(json: string) {
  //   this.jsonOutputSource.next(json);
  // }

  changeJsonOutput(json: string) {
    if (this.jsonOutputSource.value !== json) {
      this.jsonOutputSource.next(json);
    }
  }


  // Define a new BehaviorSubject
  // private pathsAndBoxesSubject = new Subject<{ paths: string[], boxes: { left: number, top: number, width: number, height: number }[] } | null>();
  private pathsAndBoxesSubject = new Subject<{ paths: string[], boxes: string[] } | null>();
  
  // Expose the BehaviorSubject as an Observable for create-components to subscribe to
  public pathsAndBoxes$ = this.pathsAndBoxesSubject.asObservable();

  // Method to update the BehaviorSubject value
  // updatePathsAndBoxes(paths: string[], boxes: { left: number, top: number, width: number, height: number }[]) {
  //   this.pathsAndBoxesSubject.next({ paths, boxes });
  // }
  updatePathsAndBoxes(paths: string[], boxes: string[]) {
    this.pathsAndBoxesSubject.next({ paths, boxes });
  }


  // for re
  private pathAndRegexSubject = new Subject<{Path: string[], InputValues: string[]} | null>();
  public pathAndRegex$ = this.pathAndRegexSubject.asObservable();
  updatePathAndRegex(Path: string[], InputValues:string[]){
    this.pathAndRegexSubject.next({Path, InputValues});
  }


  // Store input values to session storage
  saveInputData(index: number, value: string): void {
    sessionStorage.setItem('input_' + index, value);
  }

  // Retrieve input values from session storage
  getInputData(index: number): string | null {
    return sessionStorage.getItem('input_' + index);
  }
}
