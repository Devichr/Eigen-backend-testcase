import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsInt } from 'class-validator';

export class BookDto {
    @IsInt()
    id: number;

    @IsString()
    @IsNotEmpty()
    code: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    author: string;

    @IsInt()
    stock: number;

    @IsBoolean()
    isBorrowed: boolean;

    @IsOptional()
    borrowedBy?: number; // Just the member ID, not the whole member object
}
