import { TestBed } from '@angular/core/testing';

// import { Order } from './order';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { OrderService } from './order.service';


describe('Order', () => {
  let service: Order;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Order);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
