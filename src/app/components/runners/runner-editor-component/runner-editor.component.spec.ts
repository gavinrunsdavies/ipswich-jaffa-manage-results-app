import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunnerEditorComponent } from './runner-editor.component';

describe('RunnerEditorComponent', () => {
  let component: RunnerEditorComponent;
  let fixture: ComponentFixture<RunnerEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunnerEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunnerEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
