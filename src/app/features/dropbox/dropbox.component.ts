import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
declare const Dropbox: any;

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-dropbox',
  templateUrl: './dropbox.component.html',
})
export class DXComponent {
  fileUrl: string;

  constructor() {}

  openDropboxChooser() {
    const options = {
      success: (files: any) => {
        console.log('Files selected:', files);
        if (files.length > 0) {
          this.fileUrl = files[0].link;
        }
      },
      cancel: () => {
        console.log('Chooser cancelled');
      },
      linkType: 'direct',
      multiselect: false,
      extensions: ['.pdf', '.doc', '.docx', '.png', '.jpeg', '.jpg', '.svg'],
    };

    const button = Dropbox.createChooseButton(options);
    document.getElementById('container').appendChild(button);
  }
}
