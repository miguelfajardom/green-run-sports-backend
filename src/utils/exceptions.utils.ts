import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor() {
    super(
      'User not found',
      HttpStatus.NOT_FOUND,
    );
  }
}

export class UserNotFoundOrBlockedException extends HttpException {
  constructor() {
    super(
      'User not found or is blocked',
      HttpStatus.NOT_FOUND,
    );
  }
}

export class InvalidPasswordException extends HttpException {
  constructor() {
    super(
      'Invalid password',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class BlockOrNotExistException extends HttpException {
  constructor() {
    super(
      'The specified user is either blocked or no longer exists',
      HttpStatus.NOT_FOUND,
    );
  }
}

export class InvalidRoleException extends HttpException {
  constructor() {
    super(
      'The assigned role is invalid or does not exist',
      HttpStatus.NOT_FOUND,
    );
  }
}

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
  constructor() {
    super(
      'Exactly one bet option with (won) status is required for event.',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class BetNotElegibleException extends HttpException {
  constructor() {
    super(
      'One or more bets are not eligible for placement due to their status or can only be placed on active bets',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class AlreadySettledBetException extends HttpException {
  constructor() {
    super('Already settled bets cannot be cancelled', HttpStatus.UNAUTHORIZED);
  }
}

export class BetsSettledCannotBeActivatedException extends HttpException {
  constructor() {
    super(
      'Bets that are already settled cannot be activated',
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class AdministratorsDoNotHaveBalance extends HttpException {
  constructor() {
    super(
      'Only users have a balance',
      HttpStatus.NOT_FOUND,
    );
  }
}

export class AdminSelfOperationNotAllowedException extends HttpException {
  constructor() {
    super(
      'Admin self-activation or self-blocking is not allowed',
      HttpStatus.NOT_FOUND,
    );
  }
}


