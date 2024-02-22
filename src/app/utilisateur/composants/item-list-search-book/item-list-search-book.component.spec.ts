import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemListSearchBookComponent } from './item-list-search-book.component';

describe('ItemListSearchBookComponent', () => {
  let component: ItemListSearchBookComponent;
  let fixture: ComponentFixture<ItemListSearchBookComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemListSearchBookComponent]
    });
    fixture = TestBed.createComponent(ItemListSearchBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
