import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filename'
})
export class FilenamePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return 'fichier audio';
    return value.split('/').pop() || 'fichier audio';
  }
} 