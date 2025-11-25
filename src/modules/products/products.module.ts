import { Module } from "@nestjs/common";
import { Product } from "./entities/product.entity";

@Module({
    imports: [Product],
    controllers: [],
    providers: [],
    exports: []
})
export class ProductsModule {}