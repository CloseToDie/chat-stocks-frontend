import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {StocksModel} from './stocks.model';
import {SocketStock} from '../../app.module';
import {AddStockDto} from './addStock.dto';

@Injectable({
  providedIn: 'root'
})
export class StocksService {

  constructor(private socket: SocketStock) { }

  addStocks(stock: AddStockDto): void {
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
