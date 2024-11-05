import * as moment from 'moment';
import { Month } from 'src/app/models/utils';
import { FileDto } from 'src/app/models/file.model';

export const helpers = {
  isText: (value: any): boolean => typeof value === "string",
  isNumber: (value: any): boolean => typeof value === "number",
  isBoolean: (value: any): boolean => typeof value === "boolean",
  isDate: (value: any): boolean => {
    const formats = ["MM/DD/YYYY", "YYYY-MM-DD"];
    return Number(value) !== null && moment(value, formats, true).isValid();
  },
  isInteger: (value: any): boolean=> typeof value === "number" && Number(Math.floor(value)) == Number(value),
  getFrenchMonth : (date: Date): Month => 
    {
      if(!date)
        return null;
      let monthString = new Intl.DateTimeFormat("fr-FR", {month: "long"}).format(date);
      monthString = monthString.slice(0, 1).toUpperCase() + monthString.slice(1, monthString.length);
      return monthString as Month
  },
  isAvatar: (value: any): boolean => {
    if(value instanceof Object && 'id' in value && 'name' in value && 'path' in value && 'type' in value && 'owner' in value){
      // Its a FileDto
      const file = value as FileDto;
      return file.type === "img"
    }
    return false;
  }
};
