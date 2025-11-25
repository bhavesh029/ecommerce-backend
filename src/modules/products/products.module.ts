import { Module } from "@nestjs/common";
import { Product } from "./entities/products.entity";

@Module({
    imports: [Product],
    controllers: [],
    providers: [],
    exports: []
})
export class ProductsModule {}