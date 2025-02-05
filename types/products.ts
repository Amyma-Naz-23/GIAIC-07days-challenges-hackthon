export interface Product {
    _id:string;
    productName :string;
    _type:"product";
    image? :{
        asset :{
            _ref:string;
            _type:"image";
        }
    };
    price: number;
    status:string,
    description:string,
    tags: string[];
    sizes: string[];
    stock_quantity: number;
    category: string;
    slug : {
        _type :"slug",
        current: string;
    };
    inventory : number;
}