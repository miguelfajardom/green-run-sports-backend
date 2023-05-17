import { HttpException, HttpStatus } from '@nestjs/common';

export class InsufficientFundsException extends HttpException {
  constructor() {
    super(
      'Insufficient balance to perform the requested action. Please deposit funds to your account',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class AdminUpdateException extends HttpException {
  constructor() {
    super(
      'Admins are not allowed to update data of other admins',
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class NoRecordsFoundException extends HttpException {
  constructor() {
    super('No records found with the given parameters', HttpStatus.NOT_FOUND);
  }
}

export class MultipleWinningOptionsException extends HttpException {
  constructor() {
    super(
      'Invalid bet options. There should be exactly one option with "won" result.',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class EventnotFoundException extends HttpException {
  constructor() {
    super('Event not found', HttpStatus.NOT_FOUND);
  }
}

export class InvalidBetOptionException extends HttpException {
  constructor(message) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class BetNotElegibleException extends HttpException {
  constructor() {
    super('One or more bets are not eligible for placement due to their status or can only be placed on active bets', HttpStatus.BAD_REQUEST);
  }
}

export class AlreadySettledBetException extends HttpException {
  constructor() {
    super("Already settled bets cannot be cancelled", HttpStatus.UNAUTHORIZED);
  }
}

export class BetsSettledCannotBeActivatedException extends HttpException {
  constructor() {
    super('Bets that are already settled cannot be activated', HttpStatus.UNAUTHORIZED);
  }
}





