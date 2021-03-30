import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {StocksModel} from './stocks.model';
import {SocketStock} from '../../app.module';

@Injectable({
  providedIn: 'root'
})
export class StocksService {

  constructor(private socket: SocketStock) { }

  addStocks(stock: StocksModel): void {
    this.socket.emit('add', stock);
  }

  listenForStock(): Observable<StocksModel> {
    return this.socket
      .fromEvent<StocksModel>('stock');
  }

  getAllStocks(): Observable<StocksModel[]> {
    return this.socket
      .fromEvent<StocksModel[]>('stocks');
  }

  increment(id: string): void {
    this.socket.emit('increment', id);
  }

  decrement(id: string): void {
    this.socket.emit('decrement', id);
  }
}
