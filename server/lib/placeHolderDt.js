const Usersource = "https://fakestoreapi.com";
const productSource = "https://api.escuelajs.co/api/v1/products"
const getUsers = async () => {
    const users = await fetch(`${Usersource}/users`).then((res) => res.json());
    return users;
}
const getProducts = async () => {
    const products = await fetch(`https://api.escuelajs.co/api/v1/products`).then((res) => res.json());
    return products;
}

export { getUsers, getProducts}; 