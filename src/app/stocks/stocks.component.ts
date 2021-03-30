import { Component, OnInit } from '@angular/core';
import {StocksModel} from './shared/stocks.model';
import {StocksService} from './shared/stocks.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {AddStockDto} from './shared/addStock.dto';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss']
})
export class StocksComponent implements OnInit {
  stocks$: Observable<StocksModel[]> | undefined;
  addStockName = new FormControl('');
  addStockDesc = new FormControl('');
  addStockPrice = new FormControl('');

  constructor(private stocksService: StocksService) { }

  ngOnInit(): void {
    this.stocks$ = this.stocksService.getAllStocks();
  }

  addStock(): void {
    if (this.addStockName.value && this.addStockPrice.value) {
      const name = this.addStockName.value;
      const description = this.addStockDesc.value;
      const price = this.addStockPrice.value;
      const stock: AddStockDto = {name, description, price};
      this.stocksService.addStocks(stock);
      this.clearAddForm();
    }
  }

  private clearAddForm(): void {
    this.addStockName.patchValue('');
    this.addStockDesc.patchValue('');
    this.addStockPrice.patchValue('');
  }

  increment(id: string): void {
    this.stocksService.increment(id);
  }

  decrement(id: string): void {
    this.stocksService.decrement(id);
  }
}
