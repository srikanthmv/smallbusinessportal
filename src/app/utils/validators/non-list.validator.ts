import {AbstractControl, ValidatorFn} from "@angular/forms";

export function nonListValidator(list: any[], key?: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    // if key param has a value check if the value is present in the list of objects matching for that key
    if (key !== undefined) {
      const matchedObj = list.find((obj) => obj[`${key}`] === control.value);
      if (control.value && matchedObj === undefined) {
        return { 'notInList': true };
      }
    } else {
      if (control.value && list.indexOf(control.value) === -1) {
        return { 'notInList': true };
      }
    }
    return null;
  };
}
