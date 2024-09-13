import { IsString, MinLength } from "class-validator";

export class ShippingAddressDto {
    @IsString({message: "Name is required."})
    @MinLength(1)
    name: string;

    @IsString({message: "Phone number is required."})
    @MinLength(5)
    phone: string;

    @IsString({message: "Country is required."})
    @MinLength(1)
    country: string;

    @IsString({message: "City is required."})
    @MinLength(1)
    city: string;

    @IsString({message: "Address line 1 is required."})
    @MinLength(1)
    line1: string;

    @IsString({message: "Address line 2 is required."})
    @MinLength(1)
    line2: string;

    @IsString({message: "State is required."})
    @MinLength(1)
    state: string;
    
    @IsString({message: "PostalCode is required."})
    @MinLength(5)
    postal_code: string;
}