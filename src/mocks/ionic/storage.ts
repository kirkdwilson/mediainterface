import { Injectable } from '@angular/core';

@Injectable()
export class StorageMock {
  private data: any = {};

  set(key: string, val: string) {
    return new Promise((resolve, reject) => {
      this.data[key] = val;
      resolve(true);
    });
  }

  get(key: string) {
    return new Promise((resolve, reject) => {
      resolve(this.data[key]);
    });
  }

  remove(key: string) {
    return new Promise((resolve, reject) => {
      resolve(null);
    });
  }

}
