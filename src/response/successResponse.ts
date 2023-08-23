import { HttpStatus } from '@nestjs/common';

export class CustomResponse {
  constructor(status: number, message: string, data?: any) {
    this.status = status;
    this.message = message;
    if (data) {
      this.data = data;
    }
  }

  status: number;
  message: string;
  data?: any;
}
