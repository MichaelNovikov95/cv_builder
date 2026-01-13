import {TestBed} from '@angular/core/testing';
import {FormBuilder} from '@angular/forms';
import {CvStoreService} from '../../services/cv-store.service';
import {CvFormService} from '../../services/cv-form.service';
import {CvEditorComponent} from './cv-editor.component';

describe('CvEditorComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CvEditorComponent]
    }).compileComponents();
  });

  it('should create the Editor Component', () => {
    const fixture = TestBed.createComponent(CvEditorComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });


});
