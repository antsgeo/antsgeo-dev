import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterMarkersProfile',
  pure: false
})
export class FilterMarkersProfilePipe implements PipeTransform {

  transform(items: any[], args): any {
    if (!items) return undefined;
    
    let arg = args.toLowerCase();
    return items.filter(item => item.name.toLowerCase().indexOf(arg) !== -1);
  }
}
