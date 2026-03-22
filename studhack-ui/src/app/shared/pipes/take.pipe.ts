import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'take',
})
export class TakePipe implements PipeTransform {
  transform<T>(value: readonly T[], count: number): T[] {
    return value.slice(0, count);
  }
}
