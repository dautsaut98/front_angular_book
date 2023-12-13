import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrairieUtilisateurComponent } from './librairie-utilisateur.component';

describe('LibrairieUtilisateurComponent', () => {
  let component: LibrairieUtilisateurComponent;
  let fixture: ComponentFixture<LibrairieUtilisateurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LibrairieUtilisateurComponent]
    });
    fixture = TestBed.createComponent(LibrairieUtilisateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
