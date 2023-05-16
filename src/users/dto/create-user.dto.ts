import { BadRequestException } from '@nestjs/common';
import { ClassTransformOptions, TransformationType } from 'class-transformer';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TransformOptions } from 'stream';

export class CreateUserDto {
  @Transform(({ value, obj }) => {
    if (obj.passowrd.includes(obj.name.trim())) {
      throw new BadRequestException(
        'password는 name과 같은 문자열을 포함할 수 없습니다.',
      );
    }
    return value.trim();
  })
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  readonly name: string;

  @IsString()
  @IsEmail()
  @MaxLength(60)
  readonly email: string;

  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  readonly password: string;
}

export declare function Transform(
  transformFn: (params: TransformFnParams) => any,
  options?: TransformOptions,
): PropertyDecorator;

export interface TransformFnParams {
  value: any;
  key: string;
  obj: any;
  type: TransformationType;
  options: ClassTransformOptions;
}
