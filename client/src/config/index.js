// client/src/config/index.js

export const registerFormControls = [
   { 
   name : 'userName',
    label : 'User Name',
    placeholder: 'Enter your user name',
    componentType : 'input',
    type : 'text',
    },
   { 
   name : 'email',
    label : 'Email',
    placeholder: 'Enter your user email',
    componentType : 'input',
    type : 'email',
    },
   { 
   name : 'password',
    label : 'Password',
    placeholder: 'Enter your user password',
    componentType : 'input',
    type : 'password',
    },
]

export const loginFormControls = [
 
   { 
    name : 'email',
    label : 'Email',
    placeholder: 'Enter your user email',
    componentType : 'input',
    type : 'email',
    },
   { 
    name : 'password',
    label : 'Password',
    placeholder: 'Enter your user password',
    componentType : 'input',
    type : 'password',
    },

]

export const addProductFormElements = [
    {
      label: "Product title",
      name: "title",
      componentType: "input",
      type: "text",
      placeholder: "Enter product title",
    },
    {
      label: "Description",
      name: "description",
      componentType: "textarea",
      placeholder: "Enter product description",
    },
    {
      label: "Category",
      name: "category",
      componentType: "select",
      options: [
        { id: "vehicles", label: "Vehicles" },
        { id: "electronics", label: "Electronics" },
        { id: "Fashion", label: "Fashion" },
        { id: "accessories", label: "Accessories" },
        { id: "footwear", label: "Footwear" },
      ],
    },
    {
      label: "Tags",
      name: "tags",
      componentType: "tags",
      type: "text",
      placeholder: "Press to add tags",
    },
    {
      label: "Price",
      name: "price",
      componentType: "input",
      type: "number",
      placeholder: "Enter product price",
    },
    {
      label: "Sale Price",
      name: "salePrice",
      componentType: "input",
      type: "number",
      placeholder: "Enter sale price (optional)",
    },
    {
      label: "Total Stock",
      name: "totalStock",
      componentType: "input",
      type: "number",
      placeholder: "Enter total stock",
    },
  ];
export const addFeatureFormElements = [
  {
    label: "Feature title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter feature title",
  },
  {
    label: "Feature subTitle",
    name: "subTitle",
    componentType: "input",
    type: "text",
    placeholder: "Enter feature subtitle",
  },
];
export const shoppingViewHeaderMenuItems = [
  {
    id : 'home',
    label : 'Home',
    path : '/shop/home',
  },
  {
    id : 'products',
    label : 'New arivals',
    path : '/shop/listing',
  },
  {
    id : 'men',
    label : 'Vehicles',
    path : '/shop/listing'
  },
  {
    id : 'women',
    label : 'Electronics',
    path : '/shop/listing'
  },
  {
    id : 'kids',
    label : 'Fashion',
    path : '/shop/listing'
  },
  {
    id : 'watch',
    label : 'Food',
    path : '/shop/listing'
  },
  {
    id : 'accessories',
    label : 'Accessories',
    path : '/shop/listing'
  },
  {
    id : 'footwear',
    label : 'Footwear',
    path : '/shop/listing'
  }
];

export const filterOptions = {
  category: [
    {id: "men", label: "Men" },
    {id: "women", label: "Women" },
    {id: "watch", label: "Watch" },
    {id: "kids", label: "Kids" },
    {id: "accessories", label: "Accessories" },
    {id: "footwear", label: "Footwear" },
  ],
  brand: [
    {id: "nike", label: "Nike" },
    {id: "adidas", label: "Adidas" },
    {id: "puma", label: "Puma" },
    {id: "levi", label: "Levi's" },
    {id: "zara", label: "Zara" },
    {id: "h&m", label: "H&M" },
  ]
};

export const sortOptions = [
  {id: "price-lowtohigh", label: "Price: Low to High"},
  {id: "price-hightolow", label: "Price: High to Low"},
  {id: "title-atoz", label: "Title: A to Z"},
  {id: "title-ztoa", label: "Title: Z to A"},
]

export const categoryOptionsMap = {
  men: "Men",
  women: "Women",
  kids: "Kids",
  watch: "Watch",
  accessories: "Accessories",
  footwear: "Footwear",
};

export const brandOptionsMap = {
  nike: "Nike",
  adidas: "Adidas",
  puma: "Puma",
  levi: "Levi",
  zara: "Zara",
  "h&m": "H&M"
};


export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name : "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name : "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name : "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name : "notes",
    componentType: "input",
    type: "textarea",
    placeholder: "Enter any additional notes",
  },
];
  
