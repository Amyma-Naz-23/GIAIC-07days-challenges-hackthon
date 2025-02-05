
export default {
    name:'order',
    type:'document',
    title:'Order',
    fields : [
        {
            name:'firstName',
            title:'firstName',
            type:'string',
        },
        {
            name: 'lastName',
            title: 'lastName',
            type: 'string',

        },
        {
            name:'address',
            title:'Address',
            type:'string',
        },
        {
            name:'country',
            title:'Country',
            type:'string',
        },
        {
            name:'city',
            title:'City',
            type:'string',
        },
        {
            name:'zipCode',
            title:'Zip Code',
            type:'string',
        },
        {
            name:'phone',
            title:'Phone',
            type:'string',
        },
        {
            name:'email',
            title:'Email',
            type:'string',
        },{

        name: 'discount',
        title: 'Discount',
        type: 'number',
        },

        {
            name:'cartItems',
            title:'Cart Items',
            type:'array',
            of:[
                {
                    type:'reference',
                    to:
                        {
                            type:'product',
                        }
                }
        
            ]
        },
        {
            name :'total',
            title:'Total',
            type:'number',
        },
        {
            name:'status',  
            title:'Status',
            type:'string',
            options:{
                list :[
                    {title:'Pending',value:'pending'},
                    {title:'Completed',value:'completed'},
                    {title:'Dispatch',value:'dispatch'},
                ],
                layout:'radio',
            },
            initialValue : 'pending',
        }   
    ]
}