import { HttpException, HttpStatus } from "@nestjs/common";

export class InsufficientFundsException extends HttpException {
    constructor() {
      super('Insufficient balance to perform the requested action. Please deposit funds to your account', HttpStatus.NOT_FOUND);
    }
}