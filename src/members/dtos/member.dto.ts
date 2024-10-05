import { IsInt, IsNotEmpty, IsOptional, IsDate } from 'class-validator';

export class MemberDto {
    @IsInt()
    id: number;

    @IsNotEmpty()
    code: string;

    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsDate()
    penaltyUntil: Date | null;

    constructor(partial: Partial<MemberDto>) {
        Object.assign(this, partial);
    }
}
